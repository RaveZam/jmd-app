import { useState, useRef } from "react";
import {
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";

export function useRouteEditing(
  routeId: string | undefined,
  initialName: string,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [routeName, setRouteName] = useState(initialName);
  const [routeNameDraft, setRouteNameDraft] = useState(initialName);
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  const handleSaveRouteName = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => {
    const trimmed = e.nativeEvent.text.trim();
    if (trimmed && routeId) {
      RoutesDao.renameRoute(routeId, trimmed);
      setRouteName(trimmed);
      setRouteNameDraft(trimmed);
    } else {
      setRouteNameDraft(routeName);
    }
    setIsEditingName(false);
  };

  const handleToggleEditing = () => {
    if (isEditing) {
      Object.values(swipeableRefs.current).forEach((ref) => ref?.close());
      setIsEditingName(false);
    }
    setIsEditing((v) => !v);
  };

  return {
    isEditing,
    isEditingName,
    setIsEditingName,
    routeName,
    routeNameDraft,
    setRouteNameDraft,
    swipeableRefs,
    handleSaveRouteName,
    handleToggleEditing,
  };
}
