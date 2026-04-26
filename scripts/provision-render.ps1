param(
  [Parameter(Mandatory = $true)]
  [string]$OwnerId,
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,
  [string]$Branch = "main",
  [string]$ServiceName = "sistematize"
)

if (-not $env:RENDER_API_KEY) {
  throw "RENDER_API_KEY nao configurada."
}

$headers = @{
  Authorization = "Bearer $env:RENDER_API_KEY"
  Accept = "application/json"
  "Content-Type" = "application/json"
}

$body = @{
  type = "web_service"
  name = $ServiceName
  ownerId = $OwnerId
  repo = $RepoUrl
  branch = $Branch
  autoDeploy = "yes"
  serviceDetails = @{
    env = "node"
    plan = "starter"
    region = "oregon"
    envSpecificDetails = @{
      buildCommand = "npm install && npm run build"
      startCommand = "npm run start"
    }
    healthCheckPath = "/api/health"
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method Post -Headers $headers -Uri "https://api.render.com/v1/services" -Body $body
