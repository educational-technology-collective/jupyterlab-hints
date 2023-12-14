import { NotebookPanel } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

export const addHintOverlay = (
  i: number,
  notebookPanel: NotebookPanel,
  settings: ISettingRegistry.ISettings
) => {
  const cell = notebookPanel.content.model?.cells.get(i);
  const cellWidget = notebookPanel.content.widgets.find(
    widget => widget.model === cell
  );
  if (cell && cellWidget) {
    // Create hint blur overlay and append to hint cell node
    const overlay = document.createElement('div');
    overlay.classList.add('hint-overlay');
    cellWidget.node.appendChild(overlay);

    // Create modal to confirm if user wants to reveal hint
    const modal = document.createElement('div');
    modal.classList.add('hint-modal');

    const updateSettings = (): void => {
      overlay.innerText = settings.get('text1').composite as string;
      modal.innerText = settings.get('text2').composite as string;
      const blurryLevel = settings.get('blurry-level').composite as number;
      overlay.style.backdropFilter = `blur(${blurryLevel}px)`;
    };
    updateSettings();
    settings.changed.connect(updateSettings);

    // Remove overlay text and append modal when user clicks on overlay
    overlay.addEventListener('click', () => {
      overlay.innerText = '';
      overlay.appendChild(modal);
    });

    // Set cell metadata to revealed and remove overlay and modal and save the notebook
    modal.addEventListener('click', () => {
      modal.innerText = '';
      overlay.classList.remove('hint-overlay');
      modal.classList.remove('hint-modal');
      cell.setMetadata('hint', false);
    });
  }
};
