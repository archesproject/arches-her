define([
    'knockout',
    'proj4',
    'underscore',
    'viewmodels/widget',
    'templates/views/components/widgets/bngpoint.htm',
], function (ko, proj4, _, WidgetViewModel, bngpointTemplate) {
    /**
    * registers a text-widget component for use in forms
    * @function external:"ko.components".text-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the text input
    * @param {string} params.config().placeholder - default text to show in the text input
    */
    return ko.components.register('bngpoint', {
        viewModel: function(params) {

            // CS - The following instantiate the variables and do not execute again after loading 
            params.configKeys = ['placeholder'];
            WidgetViewModel.apply(this, [params]);
            var self = this;
            
            this.coordOptions = ['Alphanumeric BNG','Absolute BNG','Long/Lat']
            this.coordFormat = ko.observable();
            this.isSelected = ko.observable(false);
            this.errorMessage = ko.observable();
            this.messageVisible = ko.observable(false);
            if (this.value()) {
                this.bngVal = ko.observable(this.value());
                //console.log("This Value",this.coordFormat());
            } else {
                this.bngVal = ko.observable();

                //console.log(this.coordFormat());
            };

            this.finalGridNumber = function(numberIn){
                // CS - This function adds zeros onto a number until the number's length is 5
                var fullNumber = 5
                while(numberIn.length < fullNumber){
                    numberIn = numberIn + "0"
                    console.log(numberIn);
                }
                return numberIn
            }

            this.alphanumericTransform = function(alphaBNG,BNGKeys){
                // CS - takes an alphanumeric value and ensures it has a valid grid square and 10 numbers in the value string.
                try{
                    var gridSquareLetters = alphaBNG.substring(0,2);
                    gridSquareLetters = gridSquareLetters.toUpperCase();
                    var gridSquareNumbers = alphaBNG.substring(2);
                    var gridSquareNumbersSplit = (gridSquareNumbers.length)/2
                    console.log(BNGKeys);

                    if (BNGKeys.includes(gridSquareLetters)){
                        var gridSquareEasting = gridSquareNumbers.substring(0,gridSquareNumbersSplit);
                        var gridSquareNorthing =  gridSquareNumbers.substring(gridSquareNumbersSplit);
        
                        var finalGridSquareEasting = this.finalGridNumber(gridSquareEasting);
                        var finalGridSquareNorthing = this.finalGridNumber(gridSquareNorthing);
        
                        var finalGridReference = gridSquareLetters + finalGridSquareEasting + finalGridSquareNorthing
                        return finalGridReference
                    }
                    else{
                        console.log('Could not return a correct Alphanumeric grid reference.  Please check your input absolute grid reference and try again.')
                        return ""
                        
                    }
                
                }
            
                catch(err){
                    console.log(err + '\nCould not return a correct Alphanumeric grid reference.  Please check your input absolute grid reference and try again.')
                    return ""
                    
                }

                


            }

            this.absoluteBNGTransform = function(absoluteBNG,gridSquareArray){
                // CS - Takes an absolute grid reference, checks it only contains numbers, works out the 100km grid quare
                // value and then pads the numerical value to create an Alphanumeric Grid Reference.

                try{
                    var absoluteBNG = absoluteBNG.replace(",",""); 
                    var absoluteBNGAsNumber = Number(absoluteBNG);
                    if (isNaN(absoluteBNGAsNumber)){
                        console.log('Entered valid is not numeric.  Please check your input absolute grid reference and try again.');
                        return "";
                    }
                    else{
                        var absoluteBNGSplit = (absoluteBNG.length)/2
                        var firstEastingAbsoluteBNG = absoluteBNG.substring(0,1);
                        var firstNorthingAbsoluteBNG = absoluteBNG.substring(absoluteBNGSplit,absoluteBNGSplit+1);
                        var firstValues = [Number(firstEastingAbsoluteBNG),Number(firstNorthingAbsoluteBNG)];

                        var mainEastingAbsoluteBNG = absoluteBNG.substring(1,absoluteBNGSplit);
                        var mainNorthingAbsoluteBNG = absoluteBNG.substring(absoluteBNGSplit+1);

                        var finalMainEastingAbsoluteBNG = this.finalGridNumber(mainEastingAbsoluteBNG);
                        var finalMainNorthingAbsoluteBNG = this.finalGridNumber(mainNorthingAbsoluteBNG);

                        var gridSquare = ""

                        for (var key in gridSquareArray){
                            var gridValueFromArray = (gridSquareArray[key]).toString()
                            if (gridValueFromArray === firstValues.toString()){
                                gridSquare = key
                                break;
                            }
                        }

                        if (gridSquare !== ""){
                            var finalOutputGridReference = gridSquare + finalMainEastingAbsoluteBNG + finalMainNorthingAbsoluteBNG
                            return finalOutputGridReference
                        }
                        else{
                            console.log('Grid square is not within the boundary of England.  Please check your input absolute grid reference and try again.');
                            return ""
                        }
                    }
                    
                    
                }
                catch(err){
                    console.log(err + '\nIssue transforming input coordinates into an Alphanumeric grid reference.  Please check your value is in a correct format at try again.')
                    return ""
                }

            }

            this.longLatTransform = function(latLong,gridSquareList){
                // CS - uses the Proj4JS module to reproject long/lat values to an absolute BNG value and then calls upon the 
                // absoluteBNGTransform function to create an Alphanumeric Grid Reference.
                var OSGB36Proj4 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs"
                var WGS1984Proj4 = "+proj=longlat +datum=WGS84 +no_defs"

                var latLongSplit = latLong.split(",")
                var longValue = Number(latLongSplit[0])
                var latValue = Number(latLongSplit[1])
                var longLatCoord = [longValue,latValue]

                try{
                    var reprojectOSGBCoords = proj4(WGS1984Proj4,OSGB36Proj4,longLatCoord)
                    var reprojectOSGB_X = Math.round(reprojectOSGBCoords[0])
                    var reprojectOSGB_Y = Math.round(reprojectOSGBCoords[1])

                    var reprojectOSGB = reprojectOSGB_X.toString() + "," + reprojectOSGB_Y.toString()

                    try{var reprojectAlphaOSGB = this.absoluteBNGTransform(reprojectOSGB,gridSquareList)


                        return reprojectAlphaOSGB}
                    catch(err){
                        console.log(err);
                    }

                    
                }
                catch(err){
                    console.log(err + '\nIssue reprojecting long/lat coordinates.  Please check your value is in a correct format at try again.')
                    return ""
                }


            }

            this.validateInput = function(finalBNG,gridSquareValues){
                // CS - Checks that the value to be added is a valid Alphanumeric BNG reference with length 12.
                if (finalBNG !== ""){
                    var firstTwoCharacters = finalBNG.substring(0,2);
                    var numberElement = finalBNG.substring(2);
                    if (gridSquareValues.includes(firstTwoCharacters)){
                        if (!isNaN(Number(numberElement))){
                            if (finalBNG.length === 12){
                                return true
                            }
                            else{
                                return false
                            }
                        }
                        else{
                            return false
                        }
                    }
                    else{
                        return false
                    }
                }
                else{
                    return false
                }
                

            }



            this.preview = ko.pureComputed(function() {
                

                var gridSquare = {
                    "NT":[3,6],
                    "NU":[4,6],
                    "NX":[2,5],
                    "NY":[3,5],
                    "NZ":[4,5],
                    "SD":[3,4],
                    "SE":[4,4],
                    "TA":[5,4],
                    "SJ":[3,3],
                    "SK":[4,3],
                    "TF":[5,3],
                    "TG":[6,3],
                    "SO":[3,2],
                    "SP":[4,2],
                    "TL":[5,2],
                    "TM":[6,2],
                    "SS":[2,1],
                    "ST":[3,1],
                    "SU":[4,1],
                    "TQ":[5,1],
                    "TR":[6,1],
                    "SV":[0,0],
                    "SW":[1,0],
                    "SX":[2,0],
                    "SY":[3,0],
                    "SZ":[4,0],
                    "TV":[5,0]}


                pre = this.bngVal();

                
                
                console.log(this.coordFormat());
                console.log(pre);
                console.log(this.isSelected());
                var gridLettersValueArray = Object.keys(gridSquare);
                if (this.isSelected() === true){
                    this.errorMessage("");

                }
                else{
                    if (pre){
                        if(this.coordFormat() === 'Alphanumeric BNG' && pre){
                            pre = pre.replace(" ","");
                            var firstTwoInValue = pre.substring(0,2);
                            if (gridLettersValueArray.includes(firstTwoInValue)){
                                if (pre.length === 12){
                                    pre = pre
    
                                }
                                else{
                                    pre = this.alphanumericTransform(pre,gridLettersValueArray)
                                }
    
                            }
    
                            else{
                                pre = ""
                            }
    
                        }
                        else if(this.coordFormat() === 'Absolute BNG' && pre){
                            pre = pre.replace(" ","");
                            pre = this.absoluteBNGTransform(pre,gridSquare)
    
                        }
                        else if(this.coordFormat() === 'Long/Lat' && pre){
                            pre = pre.replace(" ","");
                            pre = this.longLatTransform(pre,gridSquare)
    
                        }
                        else if(this.coordFormat() === undefined && pre){
                            this.errorMessage("You have not selected a coordinate format.  Please do so and enter the coordinate value again.");
                            pre=""
                            return;
                        }
                        else{
                            pre=""
    
                        }
                    
    
                    // Final Validation
    
                    
                        if (this.validateInput(pre,gridLettersValueArray) === true){
                            this.value(pre);
                            this.errorMessage("");
                            this.messageVisible(false);
                            return pre;
                        }
                        else{
                            this.value("");
                            this.errorMessage("Input coordinate did not pass validation.  Please check it is in one of the approved formats and try again.")
                            return "";
                        }
                    }
                    else{
                        this.errorMessage("");

                    }
                }
                
                    


				
				
            }, this);
        },
        template: bngpointTemplate
    });
});
