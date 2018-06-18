$(document).ready(function () {

    ko.applyBindings(new customerViewModel());
});

var newCustomer = { Id: "", Name: "", Address: "" };

function customerModel(data) {
    var self = this;
    self.hideId = ko.observable(false);
    self.Id = ko.observable(data.Id);
    self.Name = ko.observable(data.Name).extend({
        required: {
            params: true,
            message: "Please enter customer Name."
        }

    });
    self.Address = ko.observable(data.Address).extend({
        required: {
            params: true,
            message: "Please enter Customer Address."
        }

    });
    self.ModelErrors = ko.validation.group(self);
    self.IsValid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });

}

function customerViewModel() {
    var self = this;
    self.customers = ko.observable();
    self.selectedCustomer = ko.observable();
    self.selectedCustomerDelete = ko.observable();
    self.selectedCustomerDeleteForeignkey = ko.observable();
    self.selected = ko.observable();


    loadCustomers();
    function loadCustomers() {
        $.ajax({
            type: "GET",
            url: "/Customers/CustomerList",
            success: function (data) {
                self.customers(data);
            }
        });
    }

    self.addCustomerModal = function () {
        self.selectedCustomer(new customerModel(newCustomer));
        $("#modalTitle").html("Add New Customer");
        $("#btnAdd").show();
        $("#btnUpdate").hide();
        $("#customerModal").modal();
    };

    self.editCustomerModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedCustomer(new customerModel(selected));
        $("#modalTitle").html("Edit Customer");
        $("#btnAdd").hide();
        $("#btnUpdate").show();
        $("#customerModal").modal();
    };

    self.deleteCustomerModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedCustomerDelete(new customerModel(selected));
        $("#deleteModal").modal();
    };

    self.addCustomer = function () {
        var data = ko.toJSON(self.selectedCustomer);
        $.ajax({
            url: "/Customers/AddCustomer",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadCustomers();
                    $("#customerModal").hide();
                }
            }
        });
    };

    self.updateCustomer = function () {
        var data = ko.toJSON(self.selectedCustomer);
        $.ajax({
            url: "/Customers/UpdateCustomer",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadCustomers();
                    $("#customerModal").hide();
                }
            }
        });
    };

    self.deleteCustomer = function () {
        var data = ko.toJSON(self.selectedCustomerDelete);
        $.ajax({
            url: "/Customers/DeleteCustomer",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                    $("#DeleteConfirmationForeignKey").modal();
                }
                $("#deleteModal").hide();
                loadCustomers();
            }
        });
    };

    self.deleteCustomerReference = function () {     //Call another function to delete foreign key constraint records on sales table.
        $("#DeleteConfirmationForeignKey").modal("hide");
        var data = ko.toJSON(self.selectedCustomerDelete);
        $.ajax({
            type: "POST",
            url: "/Sales/DeleteCustomerReference",
            contentType: "application/json; charset=utf-8",
            data: data,

            success: function (deleteResult) {
                self.deleteCustomer();    //Again calling the normal delete function for Customer delete.
            }
        });
    };
}

