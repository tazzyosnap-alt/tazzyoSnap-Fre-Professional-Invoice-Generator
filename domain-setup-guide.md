# Custom Domain Setup Guide

## 🎯 Recommended Domain Names:
- `tazzysnap.com` - Main brand
- `tazzysnap.invoice` - Invoice specific
- `invoice-generator.app` - Descriptive

## 💰 Domain Pricing:
- **Namecheap**: $8-12/year
- **GoDaddy**: $10-15/year  
- **Cloudflare**: $8-10/year
- **Google Domains**: $12/year

## ⚙️ DNS Configuration:

### Root Domain (tazzysnap.com):
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

### WWW Subdomain (www.tazzysnap.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## 🔧 Vercel Configuration:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Domains
4. Add domain: `tazzysnap.com`
5. Follow DNS instructions

## ⏱️ Timeline:
- DNS Setup: 5-30 minutes
- SSL Certificate: 5-10 minutes
- Full Propagation: 24-48 hours

## ✅ Verification:
- Check DNS: https://dnschecker.org
- Test HTTPS: https://tazzysnap.com
- Verify SSL: https://www.ssllabs.com/ssltest/

## 📊 SEO Updates Needed:
- Update sitemap.xml
- Update robots.txt
- Update Google Analytics
- Update Google Search Console
