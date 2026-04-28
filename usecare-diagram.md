usecaseDiagram
    %% Actors
    actor "Web Customer" as WC
    actor "New Customer" as NC
    actor "Regis Customer" as RC
    actor "Authentication" as AU
    actor "Payment service" as PS

    %% Generalization (Inheritance)
    NC --|> WC
    RC --|> WC

    rectangle "Online Shopping System" {
        usecase "View item" as UC1
        usecase "Register" as UC2
        usecase "Add cart / View cart" as UC3
        usecase "Checkout" as UC4
    }

    %% Relationships based on your drawing
    WC --> UC1
    NC --> UC2
    RC --> UC3
    RC --> UC4

    %% Secondary Actors (Services)
    UC2 --> AU
    UC4 --> PS