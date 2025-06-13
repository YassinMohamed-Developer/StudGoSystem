using Razor.Templating.Core;

namespace StudGo.Service.Helpers.Settings
{
    public class PdfGeneratorSettings
    {
        public static async Task<string> GeneratePdfFromTemplate<T>(int templateId,T data)
        {
            // need enhancement
            var savePath = Path.Combine("wwwroot","files","documents");

            var templatePdf = Path.Combine("Templates", $"Template{templateId}.cshtml");
            
            if (!File.Exists(templatePdf)) throw new FileNotFoundException("Template Is Not Found");

            var html = await RazorTemplateEngine.RenderAsync(templatePdf, data);
            //var renderer = new ChromePdfRenderer();
            //renderer.RenderingOptions = new ChromePdfRenderOptions
            //{
            //    CssMediaType = IronPdf.Rendering.PdfCssMediaType.Print,
            //    MarginTop = 0, // Full-bleed cover
            //    MarginBottom = 0,
            //    MarginLeft = 0,
            //    MarginRight = 0,
            //    PaperSize = IronPdf.Rendering.PdfPaperSize.A4,
            //    PrintHtmlBackgrounds = true,
            //    EnableJavaScript = false,
            //};

            //using var pdfDocument = renderer.RenderHtmlAsPdf(html);
            string guid = Guid.NewGuid().ToString();
            File.WriteAllText(Path.Combine(savePath, $"{guid}.html"), html);

            //pdfDocument.SaveAs(Path.Combine(savePath,$"{guid}.pdf"));
            return $"files/documents/{guid}.html";
        }
    }
}
