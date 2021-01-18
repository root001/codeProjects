const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('Moshood123', 10),
    phone: '191 541 754 3010',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '191 541 754 3012',
    password: bcrypt.hashSync('Olajumoke002', 10),
  },
  {
    name: 'Jane Doe',
    phone: '191 541 754 3013',
    email: 'jane@example.com',
    password: bcrypt.hashSync('Omotola3058', 10),
  },
]

module.exports = users;