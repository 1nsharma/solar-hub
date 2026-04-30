const variant = process.env.APP_VARIANT || 'customer';
const isVendor = variant === 'vendor';
const isTechnician = variant === 'technician';

module.exports = ({ config }) => {
  let name = config.name;
  let slug = config.slug;
  let scheme = config.scheme;
  let packageId = config.android?.package || 'in.solarhub.app';

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
    ...config,
    name,
    slug,
    scheme,
    android: {
      ...config.android,
      package: packageId,
    },
    extra: {
      ...config.extra,
      appVariant: variant,
      defaultRole: variant,
      isDemoMode: !process.env.APP_VARIANT || process.env.APP_VARIANT === 'customer'
    }
  };
};
