import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" placeholder="email@example.com" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(<Input error="Invalid" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('handles input change', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

    await user.type(input, 'hello');
    expect(input.value).toBe('hello');
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
  });

  it('shows icon when provided', () => {
    const { container } = render(<Input icon="🔍" />);
    expect(container.textContent).toContain('🔍');
  });

  it('renders with correct type', () => {
    render(<Input type="password" placeholder="Password" />);
    const input = screen.getByPlaceholderText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('forwards ref correctly', () => {
    let ref: HTMLInputElement | null = null;
    render(<Input ref={(el) => { ref = el; }} />);
    expect(ref).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts all input attributes', () => {
    render(
      <Input
        placeholder="Test"
        maxLength={10}
        minLength={5}
        required
      />
    );
    const input = screen.getByPlaceholderText('Test') as HTMLInputElement;
    expect(input.maxLength).toBe(10);
    expect(input.minLength).toBe(5);
    expect(input.required).toBe(true);
  });
});
