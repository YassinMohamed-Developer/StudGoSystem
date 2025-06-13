using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace StudGo.Service.Helpers.Settings
{
    public class LocationSettings
    {
        public static async Task<string> GetAddressFromCoordinatesAsync(double latitude, double longitude)
        {
            HttpClient client = new HttpClient();
            try
            {
                string url = $"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json";

                client.DefaultRequestHeaders.Add("User-Agent", "CSharpApp");

                var response = await client.GetStringAsync(url);

                JObject jsonResponse = JObject.Parse(response);

                string address = jsonResponse["display_name"]?.ToString();

                return string.IsNullOrEmpty(address) ? "Address not found" : address;
            }catch(Exception ex)
            {
                return "";
            }

        }

    }
}
