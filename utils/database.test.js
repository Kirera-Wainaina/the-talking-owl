const database = require('./database');

test ('deletes the given fields', () => {
    const fields = ['field', 'orderBy'];
    const params = new URLSearchParams('?title=head-of-state&orderBy=desc&field=urlTitle');

    database.deleteKeysFromSearchParams(params, fields);
    expect(params.has('field')).toBeFalsy();
    expect(params.has('title')).toBeTruthy();
})