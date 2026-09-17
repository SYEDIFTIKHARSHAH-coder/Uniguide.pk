[xml]$doc = Get-Content 'docx_extracted\word\document.xml' -Encoding UTF8
$ns = @{w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
$paragraphs = Select-Xml -Xml $doc -XPath '//w:p' -Namespace $ns
$output = foreach($p in $paragraphs){
    $texts = Select-Xml -Xml $p.Node -XPath './/w:t' -Namespace $ns
    ($texts | ForEach-Object { $_.Node.InnerText }) -join ''
}
$output | Out-File 'srs_text.txt' -Encoding UTF8
Write-Host "Done. Lines: $(($output | Measure-Object -Line).Lines)"
