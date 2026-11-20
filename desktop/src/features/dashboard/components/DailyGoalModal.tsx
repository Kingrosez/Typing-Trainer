import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Target, Check, AlertCircle, Loader2 } from "lucide-react";

interface DailyGoalModalProps {
  isOpen: boolean;
  currentTargetMinutes: number;
  onClose: () => void;
  onSave: (targetMinutes: number) => Promise<void>;
}

const PRESET_MINUTES = [10, 15, 20, 30, 45, 60];

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  isOpen,
  currentTargetMinutes,
  onClose,
  onSave,
}) => {
  const [minutes, setMinutes] = useState<number>(currentTargetMinutes);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMinutes(currentTargetMinutes);
      setError(null);
      setIsSaving(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, currentTargetMinutes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (val: number): string | null => {
    if (isNaN(val)) return "Please enter a valid number";
    if (val < 1) return "Daily goal must be at least 1 minute";
    if (val > 120) return "Daily goal cannot exceed 120 minutes";
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    setMinutes(parsed);
    setError(validate(parsed));
  };

  const handlePresetClick = (preset: number) => {
    setMinutes(preset);
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(minutes);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(minutes);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update daily goal");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-goal-modal-title"
      aria-describedby="daily-goal-modal-desc"
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl p-6 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <h2 id="daily-goal-modal-title" className="text-lg font-bold text-foreground">
            Set Daily Practice Goal
          </h2>
        </div>

        <p id="daily-goal-modal-desc" className="text-xs text-muted-foreground mb-4">
          Choose a daily practice threshold (1 to 120 minutes) to build consistency and protect your practice streak.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="targetMinutesInput" className="block text-xs font-medium text-foreground mb-1.5">
              Target Minutes per Day
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="targetMinutesInput"
                type="number"
                min={1}
                max={120}
                value={isNaN(minutes) ? "" : minutes}
                onChange={handleInputChange}
                disabled={isSaving}
                className="w-full h-10 px-3 py-2 text-sm font-mono font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent tabular-nums"
                aria-invalid={error !== null}
                aria-describedby={error ? "daily-goal-error" : undefined}
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                minutes
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_MINUTES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  disabled={isSaving}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-all ${
                    minutes === preset
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-primary/50"
                  }`}
                >
                  {preset} mins
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              id="daily-goal-error"
              className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || error !== null || isNaN(minutes)}
              className="min-w-20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>Save Goal</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
