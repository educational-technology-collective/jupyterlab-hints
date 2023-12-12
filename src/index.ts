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
    console.log('JupyterLab extension jupyterlab-hints is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlab-hints settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for jupyterlab-hints.',
            reason
          );
        });
    }

    notebookTracker.widgetAdded.connect(
      async (_, notebookPanel: NotebookPanel) => {
        await notebookPanel.revealed;

        if (notebookPanel.content.model) {
          const cells = notebookPanel.content.model?.cells;
          for (let i = 0; i < cells.length; i++) {
            if (cells.get(i).metadata.hint) {
              addHintOverlay(i, notebookPanel);
            }
          }
        }
      }
    );
  }
};

export default plugin;
