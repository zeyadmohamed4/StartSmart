using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StartUP.Data.Context;
using StartUP.Data.Entity;

public static class DbInitializer
{
    public static async Task InitializeAsync(StartUPContext context)
    {
        // نتأكد من وجود القاعدة أو إنشائها
        await context.Database.EnsureCreatedAsync();

        if (!context.CampaignDeals.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lasttttttttttttttt 2\StartUP.Service\Seeding\CampaignDeal.json");

            var campaignDeals = JsonSerializer.Deserialize<List<CampaignDeal>>(data);

            if (campaignDeals != null && campaignDeals.Any())
            {
                await context.CampaignDeals.AddRangeAsync(campaignDeals);
                await context.SaveChangesAsync();
            }
        }
        if (!context.Users.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\Users.json");
            var users = JsonSerializer.Deserialize<List<User>>(data);

            if (users != null && users.Any())
            {
                foreach (var user in users)
                {
                    // هنا بنحول الباسورد للنص المشفر (هاش)
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }

                await context.Users.AddRangeAsync(users);
                await context.SaveChangesAsync();
            }
        }

        if (!context.Projects.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\Project.json");

            var projects = JsonSerializer.Deserialize<List<Project>>(data);

            if (projects != null && projects.Any())
            {
                await context.Projects.AddRangeAsync(projects);
                await context.SaveChangesAsync();
            }
        }  
        //if (!context.Investments.Any())
        //{
        //    var data = await File.ReadAllTextAsync(@"..\StartUP.Service\Seeding\Investment.json");

        //    var investments = JsonSerializer.Deserialize<List<Investment>>(data);

        //    if (investments != null && investments.Any())
        //    {
        //        await context.Investments.AddRangeAsync(investments);
        //        await context.SaveChangesAsync();
        //    }
        //}

        if (!context.FeedBack.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\FeedBack.json");

            var feedBacks = JsonSerializer.Deserialize<List<FeedBack>>(data);

            if (feedBacks != null && feedBacks.Any())
            {
                await context.FeedBack.AddRangeAsync(feedBacks);
                await context.SaveChangesAsync();
            }
        }

        if (!context.SuccessStories.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\SuccessStory.json");

            var successStories = JsonSerializer.Deserialize<List<SuccessStory>>(data);

            if (successStories != null && successStories.Any())
            {
                await context.SuccessStories.AddRangeAsync(successStories);
                await context.SaveChangesAsync();
            }
        }
        if (!context.fundingDetails.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\FundingDetails.json");

            var fundingDetails = JsonSerializer.Deserialize<List<FundingDetails>>(data);

            if (fundingDetails != null && fundingDetails.Any())
            {
                await context.fundingDetails.AddRangeAsync(fundingDetails);
                await context.SaveChangesAsync();
            }
        } 
        
        if (!context.ProjectDetails.Any())
        {
            var data = await File.ReadAllTextAsync(@"D:\GP\Backend\lastttttttttt\StartUP.Service\Seeding\ProjectDetails.json");

            var projectDetails = JsonSerializer.Deserialize<List<ProjectDetails>>(data);

            if (projectDetails != null && projectDetails.Any())
            {
                await context.ProjectDetails.AddRangeAsync(projectDetails);
                await context.SaveChangesAsync();
            }
        }
    }
}
