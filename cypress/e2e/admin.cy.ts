 
describe("Admin Page E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit("/");
    cy.get("input").type("Jhon");
    cy.contains("Start Chat").click();
    cy.wait(500);

    cy.visit("/");
    cy.get("input").clear().type("Alice");
    cy.contains("Start Chat").click();
    cy.wait(500);

    cy.visit("/admin");
  });

  it("should display the user list in the sidebar", () => {
    cy.intercept("GET", "/api/admin/users", {
      statusCode: 200,
      body: ["Jhon", "Alice"],
    }).as("getUsers");

    cy.reload();
    cy.wait("@getUsers");

    cy.contains("Users").should("exist");
    cy.contains("Jhon").should("exist");
    cy.contains("Alice").should("exist");
  });

  it("should display messages when a user is selected", () => {
    cy.intercept("GET", "/api/admin/users", {
      statusCode: 200,
      body: ["Jhon", "Alice"],
    }).as("getUsers");

    cy.intercept("GET", "/api/admin/messages*").as("allMessages");

    cy.reload();
    cy.wait("@getUsers");
  });

  it("should navigate to the chat page when 'Go to Chat' is clicked", () => {
    cy.get("button").contains("Go to Chat").click();
    cy.url().should("include", "/chat");
  });

  it("should log out and redirect to home", () => {
    cy.get("button").contains("Logout").click();
    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Enter your name").should("exist");
  });
});
