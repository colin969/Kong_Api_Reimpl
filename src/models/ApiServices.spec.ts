import { ApiServices } from "./ApiServices";



describe('Kongregate API - Services', function () {
    const loggedInParams = new URLSearchParams();
    loggedInParams.set('kongregate_username', 'Username');
    loggedInParams.set('kongregate_user_id', '5');
    loggedInParams.set('kongregate_game_id', '10');
    loggedInParams.set('kongregate_game_auth_token', 'Success');

    const loggedOutParams = new URLSearchParams();
    loggedOutParams.set('kongregate_user_id', '0');
    loggedOutParams.set('kongregate_game_id', '10');

    const loggedInApiServices = new ApiServices(loggedInParams);
    const loggedOutApiServices = new ApiServices(loggedOutParams);

    test('Game, Auth Token and User IDs', () => {
        expect(loggedInApiServices.getUserId()).toBe(5);
        expect(loggedInApiServices.getGameID()).toBe(10);
        expect(loggedInApiServices.getGameAuthToken()).toBe('Success');
    });

    test('Logged In', () => {
        expect(loggedInApiServices.getUsername()).toBe('Username');
        expect(loggedInApiServices.isGuest()).toBeTruthy();
        expect(loggedInApiServices.isConnected()).toBeTruthy();
    });

    test('Logged Out', () => {
        expect(loggedOutApiServices.getUsername()).toBe('Guest');
        expect(loggedOutApiServices.isGuest()).toBeFalsy();
    });

    test('Connect', () => {
        loggedInApiServices.connect();
        loggedInApiServices.connectExternal();
    })
});
