using Microsoft.EntityFrameworkCore;
using StartUP.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StartUP.Data.Context
{
    public class StartUPContext : DbContext
    {
        public StartUPContext(DbContextOptions<StartUPContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
             modelBuilder.Entity<Project>()
             .HasOne(p => p.SuccessStory)
             .WithOne(s => s.Project)
             .HasForeignKey<SuccessStory>(s => s.ProjectId)
             .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Project>()
           .HasOne(p => p.ProjectDetails)
           .WithOne(pd => pd.Project)
           .OnDelete(DeleteBehavior.NoAction);
        }
        public  DbSet<User> Users { get; set; }
        public DbSet<SuccessStory> SuccessStories { get; set; }
        public DbSet<FeedBack> FeedBack { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<GoogleLogin> GoogleLogins { get; set; }
        public DbSet<ProjectDetails> ProjectDetails { get; set; }
        public DbSet<InvestmentPrediction> InvestmentPrediction { get; set; }
        public DbSet<FundingDetails> fundingDetails { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<CampaignDeal> CampaignDeals { get; set; }
        
        
        



    }
}
