describe("Chat Application E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage(); // Garante um estado limpo antes dos testes
    cy.visit("/");
  });

  it("should log in, send a message, and see the bot response", () => {
    // Digitar o nome do usuário e iniciar o chat
    cy.get("input[placeholder='Enter your name']").type("Jhon");
    cy.get("button").contains("Start Chat").click();

    // Verificar se está na página de chat
    cy.url().should("include", "/chat");

    // Enviar uma mensagem
    cy.get("input[placeholder='Type a message...']").type("Hello bot!");
    cy.get("button").contains("Send").click();

    // Verificar se a mensagem foi enviada
    cy.contains("Jhon: Hello bot!").should("exist");

    // Verificar se o bot respondeu
    cy.contains("Bot is typing...").should("exist");
    cy.contains("Bot:").should("exist"); // O bot deve responder algo
  });

  it("should navigate to the admin page", () => {
    cy.visit("/chat");

    // Clicar no botão "Admin Panel"
    cy.get("button").contains("Admin Panel").click();

    // Verificar se redirecionou para /admin
    cy.url().should("include", "/admin");
  });

  it("should log out and redirect to home", () => {
    cy.visit("/chat");

    // Clicar no botão de logout
    cy.get("button").contains("Logout").click();

    // Verificar se foi redirecionado para a página inicial
    cy.url().should("eq", "http://localhost:3000/");
    cy.get("input[placeholder='Enter your name']").should("exist"); // Form de login visível novamente
  });
});
