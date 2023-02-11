const adminSignup = require('./admin-signup')

test('creates data to save', async () => {
    const data = {
        firstName: 'richard',
        email: 'xyz@gmail.com',
        password: '456',
        repeatPassword: '860'
    }
    const results = await adminSignup.createDataToSave(data);
    
    expect(results).toHaveProperty('firstName');
    expect(results).toHaveProperty('email');
    expect(results).toHaveProperty('password');
    expect(Object.keys(results).length).toBe(3)
})

test('creates JWT from email', async () => {
    const email = 'xyz@gmail.com';

    expect(await adminSignup.createJWT(email)).toMatch(/^.+\..+\..+$/)
})