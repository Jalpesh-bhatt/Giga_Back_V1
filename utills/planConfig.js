const planFieldMap = {
  Classic: ['name', 'address'],
  Silver: ['name', 'address', 'phone'],
  Gold: ['name', 'address', 'phone', 'email', 'location', 'image'],
  Platinium: ['name', 'address', 'phone', 'email', 'location', 'image', 'social'],
  Dimond: ['name', 'address', 'phone', 'email', 'location', 'image', 'social', 'website'],
  Premium: ['name', 'address', 'phone', 'email', 'location', 'image', 'social', 'website', 'membership']
};

module.exports = planFieldMap;
