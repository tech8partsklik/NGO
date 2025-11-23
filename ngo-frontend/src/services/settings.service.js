// src/services/settings.service.js

// 👇 This will be replaced by API in future
export const getWebsiteSettings = async () => {
  return {
    site: {
      name: "Helping Hands NGO",
      logo: "/images/logo.webp",
      favicon: "/favicon.ico",
      email: "contact@ngo.org",
      phone: "+91 9999999999",
      address: "New Delhi, India",
      donate_url: "hgug"
    },

    social_links: {
      whatsapp: "919999999999",   // only number (with country code)
      facebook: "https://facebook.com/ngo",
      instagram: "https://instagram.com/ngo",
      twitter: "https://twitter.com/ngo",
      youtube: "https://youtube.com/ngo",
      linkedin: "https://linkedin.com/company/ngo"
    },

    announcement: {
      show: true,
      items: [
        "📢 Welcome to Helping Hands NGO",
        "📢 Welcome to Helping Hands NGO",
        "💛 Donate today & support a cause",
        "<b>🎓 Free education program starts next week</b>",
        "🏥 Medical camp on Sunday at Delhi"
      ],
    },




    navbar: {
      menus: [
        { name: "Home", url: "/" },

        {
          name: "About Us",
          url: "/about",
          children: [
            { name: "Our Vision", url: "/vision" },
            { name: "Our Mission", url: "/mission" },
            { name: "Our Achievements", url: "/achievements" },
            { name: "Our Members", url: "/members" },
            { name: "Management Team", url: "/management" },
            { name: "Certificates", url: "/certificates" },
            { name: "List of Donors", url: "/donors" },
          ],
        },

        {
          name: "Membership",
          url: "#",
          children: [
            { name: "Apply for Member", url: "/membership/apply" },
            { name: "Download ID Card", url: "/membership/id-card" },
          ],
        },

        { name: "Donation", url: "/donation" },
        { name: "Gallery", url: "/gallery" },
        { name: "News", url: "/news" },
        { name: "Contact", url: "/contact" },
      ],

      roles: {
        manager_login: true,
        coordinator_login: true,
      },
    },


    footer: {
      about: "Helping Hands NGO is a non-profit organization working for the upliftment of underprivileged communities.",

      quick_links: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
        { name: "Donation", url: "/donation" },
        { name: "Membership", url: "/membership" },
      ],

      important_links: [
        { name: "Our Team", url: "/management" },
        { name: "Certificates", url: "/certificates" },
        { name: "Donors", url: "/donors" },
        { name: "Contact", url: "/contact" },
      ],
    },





    homepage: {
      banner: {
        heading: "Together We Can Make a Difference",
        description:
          "Join hands with us to support underprivileged communities",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      },

      vision:
        "A world where every individual has equal rights and opportunities.",

      mission:
        "To empower people through education, healthcare and awareness.",

      objectives: [
        {
          title: "Education",
          description:
            "Provide quality education to underprivileged children.",
        },
        {
          title: "Healthcare",
          description:
            "Organize medical camps and provide health support.",
        },
        {
          title: "Women Empowerment",
          description:
            "Support women through training and livelihood programs.",
        },
      ],
    },
  };
};
