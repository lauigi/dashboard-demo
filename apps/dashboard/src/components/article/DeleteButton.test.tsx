/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import DeleteButton from './DeleteButton';

// Mock DeleteConfirmButton
vi.mock('./DeleteConfirmButton', () => ({
  default: () => <button>Confirm Delete</button>,
}));

describe('DeleteButton', () => {
  const setup = (articleTitle = 'Test Article') => {
    const user = userEvent.setup();
    const utils = render(<DeleteButton articleTitle={articleTitle} />);
    return { user, ...utils };
  };

  describe('Initial Render', () => {
    it('renders delete button with correct text', () => {
      setup();

      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-destructive');
    });

    it('does not show dialog initially', () => {
      setup();

      expect(
        screen.queryByText('Are you absolutely sure?'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Dialog Interaction', () => {
    it('opens confirmation dialog when delete button is clicked', async () => {
      const { user } = setup();

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();
    });

    it('displays correct article title in dialog description', async () => {
      const articleTitle = 'My Important Article';
      const { user } = setup(articleTitle);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(
        screen.getByText(`Deleting - ${articleTitle}`),
      ).toBeInTheDocument();
    });

    it('shows cancel and confirm buttons in dialog', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('closes dialog when cancel button is clicked', async () => {
      const { user } = setup();

      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Are you absolutely sure?'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty article title', async () => {
      const { user } = setup('');

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.getByText('Deleting -')).toBeInTheDocument();
    });

    it('handles very long article title', async () => {
      const longTitle = 'A'.repeat(200);
      const { user } = setup(longTitle);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.getByText(`Deleting - ${longTitle}`)).toBeInTheDocument();
    });

    it('handles special characters in article title', async () => {
      const specialTitle = '<script>alert("xss")</script>';
      const { user } = setup(specialTitle);

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(
        screen.getByText(`Deleting - ${specialTitle}`),
      ).toBeInTheDocument();
    });
  });
});
