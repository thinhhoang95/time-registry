import OneSignal from 'onesignal-node';

const signal = (content) => {
    // create a new Client for a single app      
    var myClient = new OneSignal.Client({
        // note that "app" must have "appAuthKey" and "appId" keys      
        app: { appAuthKey: 'ODQ4ZWVjMzQtNjgwMC00NjJiLWJhYTAtYWJhNzRjMmUzNTA5', appId: 'c19cdf73-ee4d-4571-b632-f94555661688' }
    });

    // contents is REQUIRED unless content_available=true or template_id is set.      
    var firstNotification = new OneSignal.Notification({
        contents: {
            en: content,
        }
    });   

    myClient.sendNotification(firstNotification, function (err, httpResponse, data) {
        if (err) {
            console.log('Something went wrong...');
        } else {
            console.log(data, httpResponse.statusCode);
        }
    }); 
}

export default signal;