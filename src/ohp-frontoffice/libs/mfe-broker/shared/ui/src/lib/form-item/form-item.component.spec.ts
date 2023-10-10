import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MfeBrokerSharedUiModule } from '../mfe-broker-shared-ui.module';
import { render, screen } from '@testing-library/angular';
import { InputTextModule } from 'primeng/inputtext';
import userEvent from '@testing-library/user-event';

import { FormItemComponent } from './form-item.component';

const label = 'User name';
const formControlName = 'userName';
const labelRegex = new RegExp(label, 'i');
const mockText = 'input text';
const defaultError = 'error message';
const class1 = 'class-1';
const class2 = 'class-2';
const tooltipText = 'Custom tooltip text';

const setup = async (component: string, opts: { [key: string]: unknown }) => {
  const { fixture } = await render(`<form [formGroup]="formGroup">${component}</form>`, {
    declarations: [FormItemComponent],
    imports: [InputTextModule, FormsModule, ReactiveFormsModule, MfeBrokerSharedUiModule],
    schemas: [],
    componentProperties: {
      ...opts,
    },
  });

  return fixture;
};

describe('FormItemComponent', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      [formControlName]: new FormControl(''),
    });
  });

  describe('Label', () => {
    it('should display an input field with a matching label text', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}"></cfo-form-item>`, { formGroup });
      expect(screen.getByRole('textbox')).toEqual(screen.getByLabelText(labelRegex));
    });

    it('should display an asterisk (*) label when the field is required', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [required]="true"></cfo-form-item>`, { formGroup });
      expect(screen.getByRole('textbox')).toHaveAccessibleName(new RegExp(label + ' \\*', 'i'));
      expect(formGroup.controls[formControlName].hasValidator(Validators.required)).toBeTruthy();
    });

    it('should display an asterisk (*) label when the field has a Validators.required function', async () => {
      formGroup.controls[formControlName].setValidators(Validators.required);
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}"></cfo-form-item>`, { formGroup });
      expect(screen.getByRole('textbox')).toHaveAccessibleName(new RegExp(label + ' \\*', 'i'));
    });

    it('should pass a custom class through config to the label field', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [config]="config"></cfo-form-item>`, {
        formGroup,
        config: {
          label: {
            textClass: class1,
          },
        },
      });
      expect(screen.getByText(labelRegex)).toHaveAttribute('class', expect.stringContaining(class1));
    });

    it('should capitalise the first letter of the label text', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" [label]="label"></cfo-form-item>`, {
        formGroup,
        label: 'user name',
      });

      expect(screen.getByRole('textbox')).toHaveAccessibleName(label);
    });
  });

  describe('Tooltip', () => {
    it('should display a tooltip icon when the tooltip config is passed', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" [label]="label" [config]="config"></cfo-form-item>`, {
        formGroup,
        label,
        config: {
          hint: {
            text: tooltipText,
          },
        },
      });
      await userEvent.hover(screen.getByRole('tooltip'));
      expect(await screen.findByText(tooltipText)).toBeInTheDocument();
    });

    it('should not show the tooltip when disabled via config logic', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" [label]="label" [config]="config"></cfo-form-item>`, {
        formGroup,
        label,
        config: {
          tooltip: {
            text: tooltipText,
            showHint: false,
          },
        },
      });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Input Text', () => {
    it('should accept a formControlName', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}"></cfo-form-item>`, { formGroup });
    });

    it('should alternatively accept a formControl object', async () => {
      await setup(`<cfo-form-item [control]="formControl" label="${label}"></cfo-form-item>`, {
        formGroup,
        formControl: formGroup.controls[formControlName],
      });
    });

    it('should pass a custom class through config to the input field', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [config]="config"></cfo-form-item>`, {
        formGroup,
        config: {
          field: {
            text: { class: class1 },
          },
        },
      });

      expect(screen.getByLabelText(labelRegex)).toHaveAttribute('class', expect.stringContaining(class1));
    });

    it('should combine the shortcut and config classes for the input field', async () => {
      await setup(
        `<cfo-form-item formControlName="${formControlName}" label="${label}" [inputClass]="inputClass" [config]="config"></cfo-form-item>`,
        {
          formGroup,
          inputClass: class2,
          config: {
            field: {
              text: { class: class1 },
            },
          },
        },
      );

      expect(screen.getByLabelText(labelRegex)).toHaveAttribute('class', expect.stringContaining(`${class1} ${class2}`));
    });

    it('should register the input value in the parent formGroup', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}"></cfo-form-item>`, { formGroup });
      await userEvent.type(screen.getByRole('textbox', { name: labelRegex }), mockText);

      expect(formGroup.controls[formControlName].value).toBe(mockText);
    });

    it('should display a placeholder text when provided', async () => {
      const placeholder = 'placeholder text';
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [placeholder]="placeholder"></cfo-form-item>`, {
        formGroup,
        placeholder,
      });

      expect(screen.getByPlaceholderText(new RegExp(placeholder, 'i'))).toEqual(screen.getByRole('textbox'));
    });

    it('should disable the input field when in readOnly mode', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [isReadOnly]="true"></cfo-form-item>`, {
        formGroup,
      });

      expect(screen.getByLabelText(labelRegex)).toBeDisabled();
    });

    it('should disable the input field when in disabled mode', async () => {
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [isDisabled]="true"></cfo-form-item>`, {
        formGroup,
      });

      expect(screen.getByLabelText(labelRegex)).toBeDisabled();
    });
  });

  describe('Errors', () => {
    it('should display an error message when the error validation is triggered', async () => {
      formGroup.controls[formControlName].addValidators(Validators.requiredTrue);
      await setup(`<cfo-form-item formControlName="${formControlName}" label="${label}" [errorMessages]="errorMessages"></cfo-form-item>`, {
        formGroup,
        errorMessages: {
          required: defaultError,
        },
      });

      // errors should not be displayed if the validation is not triggered
      expect(screen.queryByText(new RegExp(defaultError))).not.toBeInTheDocument();

      const input = screen.getByLabelText(labelRegex);
      await userEvent.click(input);
      await userEvent.tab();
      expect(screen.getByText(new RegExp(defaultError))).toBeInTheDocument();
    });

    it('should pass a custom error class to the errors component', async () => {
      formGroup.controls[formControlName].addValidators(Validators.requiredTrue);
      await setup(
        `<cfo-form-item formControlName="${formControlName}" label="${label}" [config]="config" [errorMessages]="errorMessages"></cfo-form-item>`,
        {
          formGroup,
          config: {
            error: {
              class: class1,
            },
          },
          errorMessages: {
            required: defaultError,
          },
        },
      );

      // errors should not be displayed if the validation is not triggered
      expect(screen.queryByText(new RegExp(defaultError))).not.toBeInTheDocument();

      const input = screen.getByLabelText(labelRegex);
      await userEvent.click(input);
      await userEvent.tab();

      expect(screen.getByText(new RegExp(defaultError))).toHaveAttribute('class', expect.stringContaining(class1));
    });
  });
});
