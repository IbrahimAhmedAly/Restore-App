using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPagionationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagionation", JsonSerializer.Serialize(metaData, options));
            response.Headers.Add("Acess-Control-Expose-Headers", "Pagionation");
        }
    }
}