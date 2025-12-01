import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { useAnimation } from '../contexts/AnimationContext';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook for managing the logout animation sequence
 * Mirrors login animation pattern: notification → loader animation → logout → navigation
 * Total duration: 3000ms (2800ms animation + 200ms exit)
 * 
 * @param redirectTo - Where to redirect after logout (default: "/" for home page)
 *                     Use "/auth" to redirect to auth page instead
 */
export const useLogout = (redirectTo: string = "/") => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setLogoutAnimating, setLogoutLoading } = useAnimation();
  const { showNotification } = useNotification();
  const navigationRef = useRef(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isLogoutInProgressRef = useRef(false);

  // Cleanup on unmount - but only if logout isn't in progress
  const cleanup = () => {
    // Don't clear timeouts if logout is in progress
    if (isLogoutInProgressRef.current) {
      console.log('⏭️  Logout in progress - skipping cleanup');
      return;
    }
    
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    navigationRef.current = false;
    setLogoutLoading(false);
  };

  const executeLogout = async () => {
    try {
      // Check if already navigating (prevent duplicate logouts)
      if (navigationRef.current) {
        console.log('⚠️  Logout already in progress');
        return;
      }

      // Mark logout as in progress to prevent cleanup from clearing timeouts
      isLogoutInProgressRef.current = true;
      navigationRef.current = true;

      // Clear any previous timeouts but DON'T reset navigationRef
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];

      // SET ANIMATION FLAG - prevent any route changes during logout
      setLogoutAnimating(true);
      console.log('🎬 Logout animation started - blocking route changes');

      // Show notification
      showNotification("success", "Logout Successful", "You've been logged out");

      // Give notification time to render (100ms)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Start loader animation
      setLogoutLoading(true);
      console.log('🎬 Loader animation started');

      // Timeline matches login animation:
      // T+0ms: Loader mounts, state 0 visible
      // T+700ms: State 0→1
      // T+1400ms: State 1→2
      // T+2100ms: State 2 locked
      // T+2800ms: setLogoutLoading(false) - Exit animation starts
      // T+3000ms: navigate(redirectTo) - AFTER exit completes

      const loaderDuration = 700; // Per step
      const totalSteps = 3; // 3 loading states (0, 1, 2)
      const exitAnimationDuration = 200; // Exit fade animation
      const totalAnimationTime = loaderDuration * (totalSteps + 1); // 2800ms

      console.log('🔄 LOGOUT ANIMATION TIMELINE:');
      console.log(`T+0ms: Notification + Loader start (state 0)`);
      console.log(`T+700ms: State 0→1`);
      console.log(`T+1400ms: State 1→2`);
      console.log(`T+2100ms: State 2 locked`);
      console.log(`T+${totalAnimationTime}ms: setLogoutLoading(false) - Exit animation starts`);
      console.log(`T+${totalAnimationTime + exitAnimationDuration}ms: Logout reducer + Navigate to ${redirectTo}`);

      // Turn off loader after all animations complete
      const loaderTimeout = setTimeout(() => {
        console.log('✋ Turning off loader (exit animation begins)');
        setLogoutLoading(false);
      }, totalAnimationTime);
      timeoutRefs.current.push(loaderTimeout);

      // Execute logout AFTER exit animation completes
      const logoutTimeout = setTimeout(() => {
        console.log('🚀 Logout timeout fired - executing logout');
        console.log('✅ Executing logout reducer (animation complete)');

        // Call logout reducer to clear Redux state and localStorage
        dispatch(logout());
        console.log('✅ Logout reducer executed - user cleared');

        // Small delay to ensure Redux state updates propagate
        const navigationDelay = setTimeout(() => {
          // Navigate to the specified redirect destination after state updates
          navigate(redirectTo, { replace: true });
          console.log(`✅ Navigated to ${redirectTo}`);
          
          // CRITICAL FIX: Keep animation flag active for a LONG time after navigation
          // This is needed because:
          // 1. We're navigating FROM /account (ProtectedRoute) TO redirectTo
          // 2. When logout reducer clears Redux state, ProtectedRoute re-evaluates
          // 3. ProtectedRoute unmounts AccountPage, causing route guards to re-evaluate
          // 4. PublicRoute for /auth gets evaluated with null user state
          // 5. Without animation flag, PublicRoute renders <AuthPage /> briefly
          // 6. THEN the navigation commit happens and target page mounts
          // Use 1000ms to be absolutely safe - ensures destination page fully renders
          // before animation flag is cleared and route guards stop blocking
          const clearAnimationTimeout = setTimeout(() => {
            setLogoutAnimating(false);
            console.log('🎬 Logout animation ended - animation flag cleared');
            console.log(`✅ Target page (${redirectTo}) should now be fully mounted and visible`);
            
            // Mark logout as complete
            isLogoutInProgressRef.current = false;
          }, 1000);
          
          timeoutRefs.current.push(clearAnimationTimeout);
        }, 50);
        
        timeoutRefs.current.push(navigationDelay);
      }, totalAnimationTime + exitAnimationDuration);
      timeoutRefs.current.push(logoutTimeout);

    } catch (error) {
      console.error('Logout execution error:', error);
      setLogoutAnimating(false);
      setLogoutLoading(false);
      navigationRef.current = false;
      isLogoutInProgressRef.current = false;
    }
  };

  return { executeLogout, cleanup };
};
