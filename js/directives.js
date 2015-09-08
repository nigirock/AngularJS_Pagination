app.directive("singleItem",function(){
    return{
        link: function(scope,element,attributes){
            scope.data = scope[attributes["singleItem"]];
        },
        restrict: "A",
        template: "<p>{{data.products[singleId].description}}</p>" +
        "<button class='btn btn-primary' ng-click='allItem()'>Вернуться в каталог</button>"
    }
});
