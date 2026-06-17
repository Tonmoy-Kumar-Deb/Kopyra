self.addEventListener('push', function(event) {
    console.log('Push received:', event);
    
    let data = {};
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = {
                title: 'Notification',
                content: event.data.text()
            };
        }
    }
    
    const title = data.title || 'Your App';
    const content = data.content || 'New notification';
    const type = data.type || 'personal';
    const redirect = data.redirect || 'notification.html';
    
    let icon = './icon.png';
    
    if (type === 'status') {
        icon = './status-icon.png';
    } else if (type === 'application') {
        icon = './application-icon.png';
    } else if (type === 'refund') {
        icon = './refund-icon.png';
    }
    
    const options = {
        body: content,
        icon: icon,
        badge: './badge.png',
        tag: `notification-${data.id || 'default'}`,
        data: {
            url: redirect
        },
        requireInteraction: true,
        actions: [
            { action: 'view', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    const url = (event.notification.data && event.notification.data.url) ?
        event.notification.data.url :
        'notification.html';
    
    event.waitUntil(
        clients.openWindow(url)
    );
});
