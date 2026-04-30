const baseConfig = require('./app.json');

const variant = process.env.APP_VARIANT || 'customer';
const isVendor = variant === 'vendor';
const isTechnician = variant === 'technician';

module.exports = () => {
  let name = baseConfig.expo.name;
  let slug = baseConfig.expo.slug;
  let scheme = baseConfig.expo.scheme;
  let packageId = baseConfig.expo.android.package;

  if (isVendor) {
    name = 'SolarHub Vendor';
    slug = 'solar-hub-vendor';
    scheme = 'solarhub-vendor';
    packageId = 'in.solarhub.vendor';
  } else if (isTechnician) {
    name = 'SolarHub Maintenance';
    slug = 'solar-hub-technician';
    scheme = 'solarhub-technician';
    packageId = 'in.solarhub.technician';
  }

  return {
    ...baseConfig.expo,
    name,
    slug,
    scheme,
    android: {
      ...baseConfig.expo.android,
      package: packageId,
    },
    extra: {
      ...baseConfig.expo.extra,
      appVariant: variant,
      defaultRole: variant
    }
  };
};
