var radioBasketCore = function () {
   
    /*
     *Private memebers  
     */
    var _config = document.config.radioBasket;

    return {
        getChannel : function (name) {
            return _config.channel + "-" + _config[name];
        }
    };
    
}

/*
* Stores the data in a users cookie, can be updated to also make AJAX calls 
*/
var radioBasketStore = function () {
    var _config = document.config.radioBasket;
    var _core = radioBasketCore();
    var _items = [];

    /*
     * Save data to users cookie 
     */
    var updateCookie = function () {
        Cookies.set('items', JSON.stringify(_items), { expires: _config.daystoKeep, path: '/' });
     }

    /*
     * Read data from users cookie  
     */
    var readCookie = function () {
        var c = Cookies.get('items');
        if (c !== null) {
            _items = JSON.parse(c); 
        }
    }

    /*
     * Let apps know we have changed  
     */
    var _broadcastChange = function () {
        updateCookie();
        radio(_core.getChannel("change")).broadcast( _items );
    };

    /*
     * Add item to store 
     */
    radio(_core.getChannel("add")).subscribe(function (i) {
        _items.push(i);
        _broadcastChange();
    });

    /*
     * Remove item from store 
     */
    radio(_core.getChannel("remove")).subscribe(function (id) {
        var n = _items.filter(function (x) { return x.id != id; });
        if (n.length === _items.length) return;
        _items = n;
        _broadcastChange();
    });

    /*
     * Set up 
     */
    radio(_core.getChannel("init")).subscribe(function () {
        readCookie();
        _broadcastChange();
    });    
}
/*
 * Shopping basket package 
 */
var radioBasket = function () {
   
    /*
     *Private memebers  
     */
    var _errorHandler = console.log; 
    var _config = document.config.radioBasket;
    var _core = radioBasketCore();
        
    
    /*
     * Add an id to any item 
     */
    var _addId = function (item) {
        item.id = item.id || Math.random().toString(16).slice(2);
    }

    /*
     * Called when an item is added  
     */
    var _add = function (item) {
        _addId(item);
        radio(_core.getChannel("add")).broadcast(item);
    }

    /*
    * Called when any item is added
    */
    var _onAdd = function (fn) {
        radio(_core.getChannel("add")).subscribe(fn);
    }

    /*
    * Called when any item is removed
    */
    var _onRemove = function (fn) {
        radio(_core.getChannel("remove")).subscribe(fn);
    }

    /*
    * Called when any change is made
    */
    var _onChange = function (fn) {
        radio(_core.getChannel("change")).subscribe(fn);
    }

    /*
    * Called when any item is removed
    */
    var _remove = function (id) {
        radio(_core.getChannel("remove")).broadcast(id);
    }

    /*
    * signal to start set up
    */
    var _init = function () {
        radio(_core.getChannel("init")).broadcast();
    }

       
    return {
        /*
         * Returns the channel name as readonly
         */
        channel: function () {
            return document.config.radioBasket.channel;
        },

        /*
         * Add a new item to the basket
         */
        add: function (item) {
            _add(item);            
        },

        /*
         * Called when an item is added 
         */
        onAdd: function (fn) {
            _onAdd(fn);
        },

        /*
         * Called when any change to a basket is made
         */
        onChange: function (fn) {
            _onChange(fn);
        },

        /*
         * Remove an item from the basket
         */
        remove: function (id) {
            _remove(id);
        },

        /*
         * Called when an item is removed 
         */
        onRemove: function (fn) {
            _onRemove(fn);
        },

        /*
         * initialize
         */
        init: function () {
            _init();
        },
    }
}
