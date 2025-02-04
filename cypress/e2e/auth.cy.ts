describe("Authentication Page E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should allow a user to log in and navigate to the chat", () => {
    cy.get("input").type("Jhon");
    cy.contains("Start Chat").click();

    cy.url().should("include", "/chat");
    cy.contains("Chat Bot").should("exist");
  });

  it("should not proceed if username is empty", () => {
    cy.contains("Start Chat").click();

    cy.url().should("eq", "http://localhost:3000/");
  });

  it("should store the username in localStorage", () => {
    cy.get("input").type("Alice");
    cy.contains("Start Chat").click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("chatUserName")).to.eq("Alice");
    });
  });
});
