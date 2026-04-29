const baseConfig = require('./app.json');

const variant = process.env.APP_VARIANT || 'customer';
const isVendor = variant === 'vendor';

module.exports = () => ({
  ...baseConfig.expo,
  name: isVendor ? 'SolarHub Vendor' : baseConfig.expo.name,
  slug: isVendor ? 'solar-hub-vendor' : baseConfig.expo.slug,
  scheme: isVendor ? 'solarhub-vendor' : baseConfig.expo.scheme,
  android: {
    ...baseConfig.expo.android,
    package: isVendor ? 'in.solarhub.vendor' : baseConfig.expo.android.package
  },
  extra: {
    ...baseConfig.expo.extra,
    appVariant: variant,
    defaultRole: isVendor ? 'vendor' : 'customer'
  }
});
