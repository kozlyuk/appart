/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
const Auth = require('./auth');
jest.mock('./auth');

beforeEach(() => {
	// Clear all instances and calls to constructor and all methods:
	Auth.mockClear();
});

it('We can check if the consumer called the class constructor', () => {
	const auth = new Auth();
	expect(Auth).toHaveBeenCalledTimes(1);
});

it('We can check if the consumer called a method on the class instance', () => {
	// Show that mockClear() is working:
	expect(Auth).not.toHaveBeenCalled();

	const auth = new Auth();
	// Constructor should have been called again:
	expect(Auth).toHaveBeenCalledTimes(1);

	test('post to login api', expected => {
		expect(Auth.postLoginData(1, 2)).toBe(expected);
	});
});

