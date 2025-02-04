describe("Chat Application E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should log in, send a message, and see the bot response", () => {
    cy.get("input[placeholder='Enter your name']").type("Jhon");
    cy.get("button").contains("Start Chat").click();

    cy.url().should("include", "/chat");

    cy.get("input[placeholder='Type a message...']").type("Hello bot!");
    cy.get("button").contains("Send").click();

    cy.contains("Jhon: Hello bot!", { timeout: 10000 }).should("exist");

    cy.contains("Bot is typing...", { timeout: 10000 }).should("exist");

    cy.wait(2000);

    cy.get("body").then(($body) => {
      cy.log("📢 Conteúdo do chat:", $body.text());
    });

    cy.contains("Bot:", { timeout: 12000 }).should("exist");
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
