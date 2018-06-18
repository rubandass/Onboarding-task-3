$(document).ready(function () {

    ko.applyBindings(new storeViewModel());
});

var newStore = { Id: "", Name: "", Address: "" };

function storeModel(data) {
    var self = this;
    self.hideId = ko.observable(false);
    self.Id = ko.observable(data.Id);
    self.Name = ko.observable(data.Name).extend({
        required: {
            params: true,
            message: "Please enter Store Name."
        }

    });
    self.Address = ko.observable(data.Address).extend({
        required: {
            params: true,
            message: "Please enter Store Address."
        }

    });
    self.ModelErrors = ko.validation.group(self);
    self.IsValid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });

}

function storeViewModel() {
    var self = this;
    self.stores = ko.observable();
    self.selectedStore = ko.observable();
    self.selectedStoreDelete = ko.observable();


    loadStores();
    function loadStores() {
        $.ajax({
            type: "GET",
            url: "/Stores/StoreList",
            success: function (data) {
                self.stores(data);
            }
        });
    }

    self.addStoreModal = function () {
        self.selectedStore(new storeModel(newStore));
        $("#modalTitle").html("Add New Store");
        $("#btnAdd").show();
        $("#btnUpdate").hide();
        $("#storeModal").modal();
    };

    self.editStoreModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedStore(new storeModel(selected));
        $("#modalTitle").html("Edit Store");
        $("#btnAdd").hide();
        $("#btnUpdate").show();
        $("#storeModal").modal();
    };

    self.deleteStoreModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedStoreDelete(new storeModel(selected));
        $("#deleteModal").modal();
    };

    self.addStore = function () {
        var data = ko.toJSON(self.selectedStore);
        $.ajax({
            url: "/Stores/AddStore",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadStores();
                    $("#storeModal").hide();
                }
            }
        });
    };

    self.updateStore = function () {
        var data = ko.toJSON(self.selectedStore);
        $.ajax({
            url: "/Stores/UpdateStore",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadStores();
                    $("#storeModal").hide();
                }
            }
        });
    };

    self.deleteStore = function () {
        var data = ko.toJSON(self.selectedStoreDelete);
        $.ajax({
            url: "/Stores/DeleteStore",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                    $("#DeleteConfirmationForeignKey").modal();
                }
                $("#deleteModal").hide();
                loadStores();
            }
        });
    };

    self.deleteStoreReference = function () {     //Call another function to delete foreign key constraint records on sales table.
        $("#DeleteConfirmationForeignKey").modal("hide");
        var data = ko.toJSON(self.selectedStoreDelete);
        $.ajax({
            type: "POST",
            url: "/Sales/DeleteStoreReference",
            contentType: "application/json; charset=utf-8",
            data: data,

            success: function (deleteResult) {
                self.deleteStore();    //Again calling the normal delete function for Store delete.
            }
        });
    };
}

