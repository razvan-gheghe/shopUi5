sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Label",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageToast, Dialog, Button, Input, Label, JSONModel) {
    "use strict";
    return Controller.extend("magazin.controller.View1", {
      onAdd: function () {
        var oModel = this.getView().getModel();
        var produse = oModel.getProperty("/produse");
        var nextId = produse.length + 1;

        var oDialog = new Dialog({
          title: "Adaugă Produs",
          content: [
            new Label({ text: "Nume Produs" }),
            new Input("inputNumeProdus", {
              placeholder: "Introduceți numele produsului",
            }),
            new Label({ text: "Cantitate" }),
            new Input("inputCantitateProdus", {
              placeholder: "Introduceți cantitatea",
              type: "Number",
            }),
          ],
          beginButton: new Button({
            text: "Adaugă",
            press: function () {
              var nume = sap.ui.getCore().byId("inputNumeProdus").getValue();
              var cantitate = sap.ui
                .getCore()
                .byId("inputCantitateProdus")
                .getValue();

              produse.push({
                id: nextId,
                nume: nume,
                cantitate: parseInt(cantitate),
              });
              oModel.setProperty("/produse", produse);

              oDialog.close();
            },
          }),
          endButton: new Button({
            text: "Anulează",
            press: function () {
              oDialog.close();
            },
          }),
        });

        oDialog.open();
      },

      onEdit: function (oEvent) {
        var oModel = this.getView().getModel();
        var oItem = oEvent
          .getSource()
          .getParent()
          .getBindingContext()
          .getObject();

        // Preluăm datele produsului selectat
        var currentId = oItem.id;
        var currentNume = oItem.nume;
        var currentCantitate = oItem.cantitate;

        // Creăm un dialog pentru editare
        var oDialog = new Dialog({
          title: "Editează Produs",
          content: [
            new Label({ text: "Nume Produs" }),
            new Input("editNumeProdus", { value: currentNume }),
            new Label({ text: "Cantitate" }),
            new Input("editCantitateProdus", {
              value: currentCantitate,
              type: "Number",
            }),
          ],
          beginButton: new Button({
            text: "Salvează",
            press: function () {
              var nume = sap.ui.getCore().byId("editNumeProdus").getValue();
              var cantitate = sap.ui
                .getCore()
                .byId("editCantitateProdus")
                .getValue();

              // Actualizăm produsul în model
              var produse = oModel.getProperty("/produse");
              for (var i = 0; i < produse.length; i++) {
                if (produse[i].id === currentId) {
                  produse[i].nume = nume;
                  produse[i].cantitate = parseInt(cantitate);
                  break;
                }
              }

              oModel.setProperty("/produse", produse);
              oDialog.close();
              MessageToast.show("Produsul a fost actualizat!");
            },
          }),
          endButton: new Button({
            text: "Anulează",
            press: function () {
              oDialog.close();
            },
          }),
        });

        oDialog.open();
      },

      onDelete: function (oEvent) {
        var oModel = this.getView().getModel();
        var produse = oModel.getProperty("/produse");

        var oItem = oEvent
          .getSource()
          .getParent()
          .getBindingContext()
          .getObject();
        var newProduse = produse.filter(function (produs) {
          return produs.id !== oItem.id;
        });

        oModel.setProperty("/produse", newProduse);
      },
      onSearch: function (oEvent) {
        // Obținem valoarea introdusă în câmpul de căutare
        var sQuery = oEvent.getParameter("newValue");

        // Referința la tabel folosind id-ul "tableId" din XML
        var oTable = this.getView().byId("tableId");

        // Asigură-te că binding-ul este corect pentru tabel
        if (oTable) {
          var oBinding = oTable.getBinding("items");

          // Dacă există text introdus, creăm un filtru
          if (sQuery) {
            var oFilter = new sap.ui.model.Filter(
              "nume",
              sap.ui.model.FilterOperator.Contains,
              sQuery
            );
            oBinding.filter([oFilter]);
          } else {
            // Dacă nu este nimic introdus, eliminăm filtrul
            oBinding.filter([]);
          }
        } else {
          console.error("Tabelul nu a fost găsit!");
        }
      },
    });
  }
);
