# useEcho
`useEcho` is a wrapper around [Laravel Echo](https://github.com/laravel/echo) ([docs](https://laravel.com/docs/5.8/broadcasting)) that exposes a react style hook to interact with channels to receive websocket events (via socket.io).

# Usage

#### 1. Generate Command:
```sh
php artisan make:event OrdersUpdateEvent
```

#### 2. Setup `OrdersUpdateEvent::__construct()` and `brodcastOn()`. The key used in `brodcastOn()` is the channel, and the class name is the event key.

```php
class OrdersUpdateEvent extends Event implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $request;

    public function __construct(User $user, BulkOrderUpdateRequest $request)
    {
        $this->user = $user;
        $this->request = $request;
    }

    public function broadcastOn()
    {
        return ['app.order.updates'];
    }
}
```

#### 3. Javascript Hook usage within a context or component.
```js
useEcho({
  channel: 'app.order.updates', // key defined in OrdersUpdateEvent::brodcastOn()
  events: {
    // events are key/value pairs of: { [eventClassName]: fn_callback(payload) }
    OrdersUpdateEvent: e => console.log('OrdersUpdateEvent', {
      user,
      request // the payload is passed as defined in OrdersUpdateEvent::__construct()
    }),
    OtherEvent: e => console.log('OtherEvent', e),
  },
});
```

# TODO
* enable support for different types of channels (Private/Presence)