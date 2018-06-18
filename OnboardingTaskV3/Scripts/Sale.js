$(document).ready(function () {
    ko.applyBindings(new saleViewModel());
});


//function newSale() {
//    var self = this;
//    self.Id("");
//    self.CustomerId("");
//    self.ProductId("");
//    self.StoreId("");
//    var inputDate = $('#dateInput').val("");
//    self.DateSold = ko.observable(inputDate);
//}

function saleModel(data) {
    var self = this;
    self.hideId = ko.observable(false);
    self.Id = ko.observable(data.Id);
    self.Customer = ko.observable(data.Customer);
    self.Product = ko.observable(data.Product);
    self.Store = ko.observable(data.Store);

    //self.selectedCustomer = ko.observable(data.CustomerId);
    //self.selectedProduct = ko.observable(data.ProductId);
    //self.selectedStore = ko.observable(data.StoreId);
    //self.DateSold = ko.observable(data.DateSold);

    self.CustomerId = ko.observable(data.CustomerId).extend({
        required: {
            params: true,
            message: "Please select Customer."
        }

    });

    self.ProductId = ko.observable(data.ProductId).extend({
        required: {
            params: true,
            message: "Please select Product."
        }

    });
    self.StoreId = ko.observable(data.StoreId).extend({
        required: {
            params: true,
            message: "Please select Store."
        }

    });
    //self.DateSold = ko.observable(data.DateSold).extend({
    //    required: {
    //        params: true,
    //        message: "Please enter Date."
    //    }
    //});



    var rawSoldDate = new Date(data.DateSold);
    var day = ("0" + rawSoldDate.getDate()).slice(-2);
    var month = ("0" + (rawSoldDate.getMonth() + 1)).slice(-2);
    var dateSold = rawSoldDate.getFullYear() + "-" + month + "-" + day; //JS accepts YYYY/MM/DD format.
    self.DateSold = ko.observable(dateSold).extend({
        required: {
            params: true,           //"^(0?[1-9]|1[0-2])/(0?[1-9]|1[0-9]|2[0-9]|3[01])/\d{4}$"
            message: "Please enter Date."
        }
    });

    self.ModelErrors = ko.validation.group(self);
    self.IsValid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });

}

function saleViewModel() {
    var self = this;
    self.sales = ko.observable(loadSales());
    self.selectedSale = ko.observable();
    self.selectedSaleDelete = ko.observable();
    self.availableCustomers = ko.observableArray(getCustomers());
    function getCustomers() {
        $.ajax({
            type: "GET",
            url: "/Customers/CustomerList",
            success: function (result) {
                self.availableCustomers(result);
            }
        });
    }

    self.availableProducts = ko.observableArray(getProducts());
    function getProducts() {
        $.ajax({
            type: "GET",
            url: "/Products/ProductList",
            success: function (result) {
                self.availableProducts(result);
            }
        });
    }


    self.availableStores = ko.observableArray(getStores());
    function getStores() {
        $.ajax({
            type: "GET",
            url: "/Stores/StoreList",
            success: function (result) {
                self.availableStores(result);
            }
        });
    }

    //loadSales();
    function loadSales() {
        $.ajax({
            type: "GET",
            url: "/Sales/SaleList",
            success: function (data) {
                self.sales(data);
            }
        });
    }

    self.addSaleModal = function () {
        self.selectedSale(new saleModel(saleModel));
        $("#modalTitle").html("Add New Sale");
        $("#btnAdd").show();
        $("#btnUpdate").hide();
        $("#saleModal").modal();
    };

    self.editSaleModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedSale(new saleModel(selected));
        $("#modalTitle").html("Edit Sale");
        $("#btnAdd").hide();
        $("#btnUpdate").show();
        $("#saleModal").modal();
    };

    self.deleteSaleModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedSaleDelete(new saleModel(selected));
        $("#deleteModal").modal();
    };

    self.addSale = function () {
        var data = ko.toJSON(self.selectedSale);
        $.ajax({
            url: "/Sales/AddSale",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadSales();
                    $("#SaleModal").hide();
                }
            }
        });
    };

    self.updateSale = function () {
        var data = ko.toJSON(self.selectedSale);
        $.ajax({
            url: "/Sales/UpdateSale",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadSales();
                    $("#saleModal").hide();
                }
            }
        });
    };

    self.deleteSale = function () {
        var data = ko.toJSON(self.selectedSaleDelete);
        $.ajax({
            url: "/Sales/DeleteSale",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadSales();
                    $("#deleteModal").hide();
                }
            }
        });
    };
}

