// VDCMF Website Configuration
// Edit this file to make updates to the website

const websiteConfig = {
    organization: {
        name: "Vision De Melbee Care Foundation",
        shortName: "VDCMF",
        tagline: "Restoring Dignity. Empowering Generations",
        email: "info@vdcmf.org",
        website: "www.vdcmf.org"
    },
    colors: {
        primary: "#008080",
        primaryDark: "#006666",
        secondary: "#20B2AA",
        accent: "#00CED1",
        dark: "#1a1a1a",
        light: "#f0f8f8",
        white: "#ffffff",
        gray: "#666666"
    },
    contact: {
        address: "[Your Address], Ghana",
        phone: "[Your Phone Number]",
        whatsapp: "[Your WhatsApp Number]"
    },
    stats: {
        livesImpacted: 5000,
        programs: 50,
        volunteers: 100,
        years: 10
    },
    programs: [
        {
            icon: "fa-graduation-cap",
            title: "Education",
            description: "Providing access to quality education for underprivileged children and youth through scholarships and learning resources."
        },
        {
            icon: "fa-tools",
            title: "Vocational Empowerment",
            description: "Equipping individuals with practical skills and trade training for economic independence and self-reliance."
        },
        {
            icon: "fa-heartbeat",
            title: "Health Outreach",
            description: "Promoting health and wellness through medical assistance, health screenings, and wellness programs."
        },
        {
            icon: "fa-bullhorn",
            title: "Advocacy",
            description: "Championing the rights of vulnerable populations and raising awareness on critical social issues."
        }
    ],
    activities: [
        {
            icon: "fa-brain",
            title: "Breaking the Silence: Men's Mental Health Awareness",
            description: "Raising awareness about mental health challenges faced by men, encouraging open conversations, and providing resources for mental well-being support."
        },
        {
            icon: "fa-baby",
            title: "Teenage Pregnancy Prevention in Rural Communities",
            description: "Educational outreach programs for students in rural communities, focusing on reproductive health, life skills, and creating pathways for a brighter future."
        },
        {
            icon: "fa-pills",
            title: "Substance Abuse Awareness and Prevention Among Youth",
            description: "Community workshops and campaigns to educate youth about the dangers of substance abuse and empower them to make healthy choices."
        }
    ],
    social: {
        facebook: "https://facebook.com/vdcmf",
        twitter: "https://twitter.com/vdcmf",
        instagram: "https://instagram.com/vdcmf",
        linkedin: "https://linkedin.com/company/vdcmf"
    },
    payments: {
        bankTransfer: {
            bankName: "[Bank Name]",
            accountName: "Vision De Melbee Care Foundation",
            accountNumber: "[Account Number]",
            branch: "[Branch]",
            swiftCode: "[SWIFT Code]",
            showDetails: true
        },
        mobileMoney: {
            network: "MTN",
            number: "[Phone Number]",
            name: "[Account Name]",
            showDetails: true
        },
        paypal: {
            email: "donate@vdcmf.org",
            showDetails: true
        }
    }
};

function applyConfig() {
    // Apply colors
    document.documentElement.style.setProperty('--primary', websiteConfig.colors.primary);
    document.documentElement.style.setProperty('--primary-dark', websiteConfig.colors.primaryDark);
    document.documentElement.style.setProperty('--secondary', websiteConfig.colors.secondary);
    document.documentElement.style.setProperty('--accent', websiteConfig.colors.accent);
    document.documentElement.style.setProperty('--dark', websiteConfig.colors.dark);
    document.documentElement.style.setProperty('--light', websiteConfig.colors.light);
    document.documentElement.style.setProperty('--white', websiteConfig.colors.white);
    document.documentElement.style.setProperty('--gray', websiteConfig.colors.gray);

    // Apply organization name
    document.querySelectorAll('.logo span').forEach(el => el.textContent = websiteConfig.organization.shortName);
    document.querySelectorAll('.footer-logo p').forEach(el => el.textContent = websiteConfig.organization.name);
    document.querySelectorAll('.hero-content h1').forEach(el => el.textContent = websiteConfig.organization.name);
    document.querySelectorAll('.tagline').forEach(el => el.textContent = websiteConfig.organization.tagline);

    // Apply contact info
    document.querySelector('.contact-item:nth-child(1) p').textContent = websiteConfig.contact.address;
    document.querySelector('.contact-item:nth-child(2) p').textContent = websiteConfig.contact.phone;
    document.querySelector('.contact-item:nth-child(3) p').textContent = websiteConfig.organization.email;
    document.querySelector('.contact-item:nth-child(4) p').textContent = websiteConfig.contact.whatsapp;

    // Apply stats
    const statBoxes = document.querySelectorAll('.stat-box');
    if (statBoxes[0]) statBoxes[0].querySelector('h3').textContent = websiteConfig.stats.livesImpacted + '+';
    if (statBoxes[1]) statBoxes[1].querySelector('h3').textContent = websiteConfig.stats.programs + '+';
    if (statBoxes[2]) statBoxes[2].querySelector('h3').textContent = websiteConfig.stats.volunteers + '+';
    if (statBoxes[3]) statBoxes[3].querySelector('h3').textContent = websiteConfig.stats.years + '+';

    // Apply social links
    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks[0]) socialLinks[0].href = websiteConfig.social.facebook;
    if (socialLinks[1]) socialLinks[1].href = websiteConfig.social.twitter;
    if (socialLinks[2]) socialLinks[2].href = websiteConfig.social.instagram;
    if (socialLinks[3]) socialLinks[3].href = websiteConfig.social.linkedin;

    // Apply payment details
    const bankName = document.querySelector('.bank-name');
    const accountNumber = document.querySelector('.account-number');
    if (bankName) bankName.textContent = websiteConfig.payments.bankTransfer.bankName;
    if (accountNumber) accountNumber.textContent = websiteConfig.payments.bankTransfer.accountNumber;

    const momoNumber = document.querySelector('.momo-number');
    const momoName = document.querySelector('.momo-name');
    if (momoNumber) momoNumber.textContent = websiteConfig.payments.mobileMoney.number;
    if (momoName) momoName.textContent = websiteConfig.payments.mobileMoney.name;

    const paypalBtn = document.querySelector('.paypal-btn');
    if (paypalBtn && websiteConfig.payments.paypal.email) {
        paypalBtn.href = `https://www.paypal.com/donate?business=${websiteConfig.payments.paypal.email}`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyConfig);
} else {
    applyConfig();
}