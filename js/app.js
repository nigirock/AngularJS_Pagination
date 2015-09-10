var app = angular.module("app",["ngResource","ngRoute"]);

app.config(function($locationProvider,$routeProvider){
    $locationProvider.html5Mode(true);
        $routeProvider.when("/index.html",{
            templateUrl:"/AngularJS_Pagination/table.html"
        });
        $routeProvider.when("/singleItem",{
            templateUrl:"/AngularJS_Pagination/singleItem.html"
        });
        $routeProvider.otherwise({
            templateUrl:"/AngularJS_Pagination/index.html"
        })
    });

app.factory("pagination",function($sce){
    var currentPage = 0;
    var itemsPerPage = 4;
    var products = [];
    return{
        setProducts: function(newProducts){
            products = newProducts;
        },
        setPerPage: function(newItemPerPage){
            itemsPerPage = newItemPerPage;
        },
        getPageProducts: function(num){
            var num = angular.isUndefined(num)?0:num;
            var first = itemsPerPage*num;
            var last = first+itemsPerPage;
            currentPage = num;
            last = last > products.length?(products.length):last;
            return products.slice(first,last);
        },
        getTotalPagesNum: function(){
            return Math.ceil(products.length/itemsPerPage);
        },
        getPaginationList: function(){
            var pagesNum = this.getTotalPagesNum();
            var paginationList = [];
            paginationList.push({
                name:$sce.trustAsHtml("&laquo;"),
                link:"prev"
            });
            for(var i = 0;i<pagesNum;i++) {
                var name = i + 1;
                paginationList.push({
                    name: $sce.trustAsHtml(String(name)),
                    link: i
                });
            };
                paginationList.push({
                    name:$sce.trustAsHtml("&raquo;"),
                    link:"next"
                });
                if(pagesNum > 1){
                    return paginationList;
                }else{
                    return null;
                }
        },
        getPrevPageProducts: function() {
            var prevPageNum = currentPage - 1;
            if ( prevPageNum < 0 ) prevPageNum = 0;
            return this.getPageProducts( prevPageNum );
        },

        getNextPageProducts: function() {
            var nextPageNum = currentPage + 1;
            var pagesNum = this.getTotalPagesNum();
            if ( nextPageNum >= pagesNum ) nextPageNum = pagesNum - 1;
            return this.getPageProducts( nextPageNum );
        },
        getCurrentPageNum:function(){
            return currentPage;
        },
        getPerPage:function(){
            return itemsPerPage;
        }
    }
});

app.controller("mainCtrl",function($scope,$http,pagination,$resource,$location){
$http.get("menu.json")
    .success(function(data){
        $scope.menuObj = data;
        $scope.itemPerPage = pagination.getPerPage();
        pagination.setProducts(data.products);
        pagination.setPerPage($scope.itemPerPage);
        $scope.products = pagination.getPageProducts();
        $scope.paginationList = pagination.getPaginationList();
        $scope.pageNum = pagination.getTotalPagesNum();
    });

    $scope.showPage = function(page) {
        if ( page == 'prev' ) {
            $scope.products = pagination.getPrevPageProducts();
        } else if ( page == 'next' ) {
            $scope.products = pagination.getNextPageProducts();
        } else {
            $scope.products = pagination.getPageProducts( page );
        }
    };
    $scope.currentPageNum = function() {
        return pagination.getCurrentPageNum();
    };
    $scope.singleItem = function(item){
        $scope.singleId = item.id-1;
        $scope.hashName = (item.name).replace(/\s+/g,'');
        $location.path("/singleItem");
        $location.hash($scope.singleId + $scope.hashName);
    };
    $scope.allItem = function(){
        $location.hash("");
        $location.path("/index.html");
    };
    $scope.listItem = function(){
        pagination.setPerPage($scope.itemPerPage);
        $scope.classListItem = "col-md-12";
    };
    $scope.twoRowList = function(){
        pagination.setPerPage($scope.itemPerPage);
        $scope.classListItem = "col-md-6";
        $scope.innerBlockDescr = "row-list";
    };
});
