"use strict";

/* This file defines defaults for Igaro App.
 * For the purposes of consistency, Igaro App' in this project isn't duplicated.
 * Instead we override the route provider to fetch from api-data.igaro.com
 * You can see this in Igaro App's conf.app file.
 *
 * In other words, the configuration for Igaro App is still sent out with the App, and not fetched from the Api.
 * The purpose of this file is to provide such configuration; all the config in conf.app you can specify here.
 */

module.exports = function(req,res) {

    return Promise.resolve().then(function() {

        return Promise.resolve({

            /* Initial routes
             * You could define the initial routes here.
             */

            /* Language, country, currency support data could be defined/fetched here.
             */

            /* User specific parameters
             * You could load saved config here (such as selected timezone), or do GeoIP detection.
             */

        }).then(function (data) {

            return res.json(data);
        });
    });

};

