param(
  [string]$WebAppName = "saasevolution",
  [string]$ResourceGroup = "N8NEEVOLUTION",
  [Parameter(Mandatory = $true)]
  [string]$InstanceName
)

$settings = az webapp config appsettings list --name $WebAppName --resource-group $ResourceGroup | ConvertFrom-Json
$serverUrl = ($settings | Where-Object { $_.name -eq "SERVER_URL" }).value
$apiKey = ($settings | Where-Object { $_.name -eq "AUTHENTICATION_API_KEY" }).value

if (-not $serverUrl -or -not $apiKey) {
  throw "Nao foi possivel resolver SERVER_URL/AUTHENTICATION_API_KEY do app Evolution."
}

$headers = @{
  apikey = $apiKey
  Authorization = "Bearer $apiKey"
  "Content-Type" = "application/json"
}

$body = @{
  instanceName = $InstanceName
  integration = "WHATSAPP-BAILEYS"
  qrcode = $true
  token = $InstanceName
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Headers $headers -Uri "$($serverUrl.TrimEnd('/'))/instance/create" -Body $body
