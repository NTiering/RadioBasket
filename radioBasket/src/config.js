(function () {

    var config = function () {
        /*
        * PRIVATE
        */
        var self = this;

        /*
        * PUBLIC
        */
        self.addSection = function (name, section) {
            self[name] = section;
            self.global.configSections.push(name);
        }
    };
    /*
    * INIT
    */
    document.config = document.config || new config();

    document.config.addSection("global", {
        loadedOn: new Date(),
        configSections: []
    });
})();

