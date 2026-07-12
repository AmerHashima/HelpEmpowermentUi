let activeDialog: HTMLElement | null = null;

export function confirmDelete(message: string): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);

  activeDialog?.remove();

  return new Promise<boolean>((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'delete-confirm-overlay';
    overlay.innerHTML = `
      <section class="delete-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-confirm-title" aria-describedby="delete-confirm-message">
        <i class="bi bi-exclamation-triangle-fill delete-confirm-icon" aria-hidden="true"></i>
        <h2 id="delete-confirm-title">Confirm deletion</h2>
        <p id="delete-confirm-message"></p>
        <div class="delete-confirm-actions">
          <button type="button" class="btn btn-outline-secondary" data-action="cancel">Cancel</button>
          <button type="button" class="btn btn-danger" data-action="delete">Delete</button>
        </div>
      </section>`;

    const messageElement = overlay.querySelector('#delete-confirm-message');
    if (messageElement) messageElement.textContent = message;

    const finish = (confirmed: boolean) => {
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
      if (activeDialog === overlay) activeDialog = null;
      resolve(confirmed);
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish(false);
    };

    overlay.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target === overlay || target.closest('[data-action="cancel"]')) finish(false);
      if (target.closest('[data-action="delete"]')) finish(true);
    });
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(overlay);
    activeDialog = overlay;
    (overlay.querySelector('[data-action="cancel"]') as HTMLButtonElement)?.focus();
  });
}
