param(
  [string]$BridgeUrl = "http://127.0.0.1:8890",
  [string]$NextraProUrl = $env:NEXTRAPRO_INGEST_URL,
  [int]$PollSeconds = 2
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($NextraProUrl)) {
  throw "Set NEXTRAPRO_INGEST_URL to your published NextraPro endpoint before running this script."
}

$sharedSecret = $env:NEXTRAPRO_BRIDGE_SECRET
if ([string]::IsNullOrWhiteSpace($sharedSecret)) {
  $secureSecret = Read-Host "Paste the generated bridge secret" -AsSecureString
  $secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)
  try {
    $sharedSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
  }
}

if ([string]::IsNullOrWhiteSpace($sharedSecret)) {
  throw "A bridge secret is required."
}

$stateDirectory = Join-Path $env:LOCALAPPDATA "NextraPro"
$statePath = Join-Path $stateDirectory "mt5-bridge-state.json"
New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null

$knownPositions = @{}
$pendingEvents = @()
$initialized = $false

if (Test-Path $statePath) {
  try {
    $savedState = Get-Content -Path $statePath -Raw | ConvertFrom-Json
    $initialized = [bool]$savedState.initialized
    foreach ($position in @($savedState.positions)) {
      if ($null -ne $position.ticket) {
        $knownPositions[[string]$position.ticket] = $position
      }
    }
    $pendingEvents = @($savedState.pendingEvents)
  } catch {
    Write-Warning "Saved sync state could not be read; the current positions will be used as a fresh baseline."
  }
}

function Save-SyncState {
  $state = @{
    initialized = $initialized
    positions = @($knownPositions.Values)
    pendingEvents = @($pendingEvents)
  }
  $state | ConvertTo-Json -Depth 10 | Set-Content -Path $statePath -Encoding UTF8
}

function New-TradeEvent {
  param(
    [string]$EventType,
    $Position
  )

  $occurredAt = [DateTimeOffset]::UtcNow.ToString("o")
  return @{
    event_id = [Guid]::NewGuid().ToString("N")
    event_type = $EventType
    symbol = [string]$Position.symbol
    ticket = [long]$Position.ticket
    direction = [string]$Position.type
    volume = [double]$Position.volume
    price_open = [double]$Position.price_open
    price_current = [double]$Position.price_current
    sl = [double]$Position.sl
    tp = [double]$Position.tp
    profit = [double]$Position.profit
    occurred_at = $occurredAt
    payload = @{
      comment = [string]$Position.comment
      magic = [long]$Position.magic
      time = [long]$Position.time
      time_msc = [long]$Position.time_msc
    }
  }
}

function Send-SignedPayload {
  param([string]$JsonBody)

  $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
  $signedBytes = [Text.Encoding]::UTF8.GetBytes("$timestamp.$JsonBody")
  $keyBytes = [Text.Encoding]::UTF8.GetBytes($sharedSecret)
  $hmac = [Security.Cryptography.HMACSHA256]::new($keyBytes)
  try {
    $digest = $hmac.ComputeHash($signedBytes)
  } finally {
    $hmac.Dispose()
  }
  $signature = [BitConverter]::ToString($digest).Replace("-", "").ToLowerInvariant()

  Invoke-RestMethod -Uri $NextraProUrl -Method Post -ContentType "application/json" -Body $JsonBody -Headers @{
    "X-Nextra-Timestamp" = $timestamp
    "X-Nextra-Signature" = $signature
  } -TimeoutSec 15
}

Write-Host "NextraPro MT5 sync is running. Press Ctrl+C to stop."
Write-Host "Bridge: $BridgeUrl"
Write-Host "NextraPro receiver: $NextraProUrl"

while ($true) {
  try {
    $account = Invoke-RestMethod -Uri "$($BridgeUrl.TrimEnd('/'))/account" -Method Get -TimeoutSec 10
    $positions = @(Invoke-RestMethod -Uri "$($BridgeUrl.TrimEnd('/'))/positions" -Method Get -TimeoutSec 10)
    $currentPositions = @{}

    foreach ($position in $positions) {
      $ticket = [string]$position.ticket
      $currentPositions[$ticket] = $position

      if ($initialized -and -not $knownPositions.ContainsKey($ticket)) {
        $pendingEvents += New-TradeEvent -EventType "OPEN" -Position $position
      } elseif ($initialized -and $knownPositions.ContainsKey($ticket)) {
        $previous = $knownPositions[$ticket]
        if ([double]$previous.sl -ne [double]$position.sl -or [double]$previous.tp -ne [double]$position.tp) {
          $pendingEvents += New-TradeEvent -EventType "MODIFY" -Position $position
        }
      }
    }

    if ($initialized) {
      foreach ($ticket in @($knownPositions.Keys)) {
        if (-not $currentPositions.ContainsKey([string]$ticket)) {
          $pendingEvents += New-TradeEvent -EventType "CLOSE" -Position $knownPositions[$ticket]
        }
      }
    }

    $knownPositions = $currentPositions
    $initialized = $true
    Save-SyncState

    $payload = @{
      account = @{
        login = [long]$account.login
        server = [string]$account.server
        currency = [string]$account.currency
        balance = [double]$account.balance
        equity = [double]$account.equity
        margin = [double]$account.margin
        margin_free = [double]$account.margin_free
        margin_level = [double]$account.margin_level
        leverage = [int]$account.leverage
      }
      events = @($pendingEvents)
    }
    $jsonBody = ConvertTo-Json -InputObject $payload -Depth 10 -Compress
    $response = Send-SignedPayload -JsonBody $jsonBody

    if ($response.accepted) {
      $pendingEvents = @()
      Save-SyncState
      $eventCount = [int]$response.receivedEvents
      Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] Synced account $($account.login); sent $eventCount event(s)."
    } else {
      Write-Warning "NextraPro did not confirm the sync; pending events remain queued."
    }
  } catch {
    Write-Warning "Sync failed; pending events remain queued. $($_.Exception.Message)"
  }

  Start-Sleep -Seconds ([Math]::Max(1, $PollSeconds))
}