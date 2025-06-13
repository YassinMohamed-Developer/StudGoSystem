using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudGo.Service.Helpers.Settings
{
    public class DocumentSettings
    {
        public static string UploadFile(IFormFile file, string folderName)
        {
            //1 Get Folder Path
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\files", folderName);

            //2 Get File Name + for Uniqueness we concat it with guid
            var fileName = Guid.NewGuid() + "-" + file.FileName;

            //3 Combine FolderPath + FilePath

            var filePath = Path.Combine(folderPath, fileName);

            //Create Folder if Not Exist
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Save file
            using var fileStream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(fileStream);

            return $"files/{folderName}/"+fileName;

        }

        public static bool DeleteFile(string filePath)
        {
            try
            {
                //1 Get Folder Path
                var fullFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/", filePath);

                ////2 Combine FolderPath + FileName
                //var filePath = Path.Combine(folderPath, fileName);

                //3 Check if file exists, then delete
                if (File.Exists(fullFilePath))
                {
                    File.Delete(fullFilePath);
                    
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


    }
}
