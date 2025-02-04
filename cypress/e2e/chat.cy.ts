describe("Chat Application E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should navigate to the admin page", () => {
    cy.visit("/chat");

    cy.get("button").contains("Admin Panel").click();

    cy.url().should("include", "/admin");
  });

  it("should log out and redirect to home", () => {
    cy.visit("/chat");

    cy.get("button").contains("Logout").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.get("input[placeholder='Enter your name']").should("exist");
  });
});
