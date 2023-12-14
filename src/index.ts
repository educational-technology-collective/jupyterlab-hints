import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { addHintOverlay } from './utils';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-hints:plugin',
  description:
    'A JupyterLab extension for creating a blur effect on specified cells.',
  autoStart: true,
  optional: [INotebookTracker, ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker,
    settingRegistry: ISettingRegistry | null
  ) => {
    if (settingRegistry) {
      const setting = await settingRegistry.load(plugin.id);
      notebookTracker.widgetAdded.connect(
        async (_, notebookPanel: NotebookPanel) => {
          await notebookPanel.revealed;

          if (notebookPanel.content.model) {
            const cells = notebookPanel.content.model?.cells;
            for (let i = 0; i < cells.length; i++) {
              if (cells.get(i).metadata.hint) {
                addHintOverlay(i, notebookPanel, setting);
              }
            }
          }
        }
      );
    }
  }
};

export default plugin;
