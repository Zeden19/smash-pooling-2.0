"use client";
import {
  blueMarker,
  mapProps,
  orangeMarker,
  routeColors,
  selectedRouteColor,
} from "@/app/carpool/_maps/mapConfig";
import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import FailureToast from "@/app/_components/toast/FailureToast";
import startggClient, { slug } from "@/app/_helpers/services/startggClient";
import { GET_TOURNAMENT_BY_URL } from "@/app/_helpers/services/startggQueries";
import SuccessToast from "@/app/_components/toast/SuccessToast";
import axios from "axios";
import { handleApiError } from "@/app/_helpers/api/handleApiError";
import { Polyline } from "@/app/carpool/_maps/Polyline";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepOrigin from "@/app/carpool/add/_components/StepOrigin";
import StepTournament from "@/app/carpool/add/_components/StepTournament";
import StepRoute from "@/app/carpool/add/_components/StepRoute";
import StepDetails from "@/app/carpool/add/_components/StepDetails";
import StepReview from "@/app/carpool/add/_components/StepReview";
import type { Destination, Origin, RouteOption } from "@/app/carpool/add/types";

interface Tournament {
  id: number;
  lat: number;
  lng: number;
  mapsPlaceId: string;
  name: string;
  state: number;
  url: string;
  venueAddress: string;
  startAt?: number;
}

interface TournamentResponse {
  tournament: Tournament;
}

type Step = 0 | 1 | 2 | 3 | 4;

const transitionMs = 260;

function AddCarpoolPage() {
  const router = useRouter();
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>(0);
  const [pendingStep, setPendingStep] = useState<Step | null>(null);
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<number | null>(null);

  const [originInput, setOriginInput] = useState("Toronto");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [originError, setOriginError] = useState<string | null>(null);

  const [tournamentUrl, setTournamentUrl] = useState(
    "https://www.start.gg/tournament/bullet-hell-1/details",
  );
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tournamentError, setTournamentError] = useState<string | null>(null);
  const [tournamentStartAt, setTournamentStartAt] = useState<Date | null>(null);

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [routesError, setRoutesError] = useState<string | null>(null);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateError, setDateError] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [priceError, setPriceError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingTournament, setLoadingTournament] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [addingCarpool, setAddingCarpool] = useState(false);

  const routesLib = useMapsLibrary("routes");
  const geocodingLib = useMapsLibrary("geocoding");
  const map = useMap();

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        window.clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeStep !== 2) return;
    if (!origin || !destination) return;
    if (!routesLib || !map) return;
    if (routes.length > 0 || loadingRoutes) return;
    void fetchRoutes();
  }, [activeStep, origin, destination, routesLib, map, routes.length, loadingRoutes]);

  function goToStep(nextStep: Step) {
    if (isTransitioning || nextStep === activeStep) return;
    setTransitionDir(nextStep > activeStep ? 1 : -1);
    setPendingStep(nextStep);
    setIsTransitioning(true);
    if (transitionTimeout.current) {
      window.clearTimeout(transitionTimeout.current);
    }
    transitionTimeout.current = window.setTimeout(() => {
      setActiveStep(nextStep);
      setPendingStep(null);
      setIsTransitioning(false);
    }, transitionMs);
  }

  function clearStepData(step: Step) {
    if (step === 0) {
      setOrigin(null);
      setOriginError(null);
      return;
    }

    if (step === 3) {
      setDate(undefined);
      setDateError(null);
      setPrice("");
      setPriceError(null);
      setDescription("");
      setDescriptionError(null);
      return;
    }

    if (step === 2) {
      setRoutes([]);
      setSelectedRouteIndex(null);
      setRoutesError(null);
      return;
    }

    if (step === 1) {
      setDestination(null);
      setTournamentStartAt(null);
      setTournamentError(null);
    }
  }

  function goBack() {
    if (activeStep === 0) return;
    const targetStep = (activeStep - 1) as Step;
    clearStepData(activeStep);
    clearStepData(targetStep);
    goToStep(targetStep);
  }

  async function setOriginFromInput() {
    if (!geocodingLib || !map) {
      FailureToast("Something went wrong", "Please try again or report this error");
      return;
    }

    if (!originInput.trim()) {
      setOriginError("Origin required");
      FailureToast("Origin required");
      return;
    }

    setLoadingOrigin(true);
    setOriginError(null);

    try {
      const geocoder = new geocodingLib.Geocoder();
      const address = await geocoder.geocode({ address: originInput.trim() });

      if (address.results.length === 0) {
        setOriginError("Invalid address");
        FailureToast(
          "Something went wrong with your origin location",
          "Please make sure the address is valid",
        );
        return;
      }

      const data = address.results[0];
      const originCords = {
        lat: data.geometry.location.lat(),
        lng: data.geometry.location.lng(),
      };
      setOrigin({
        cords: originCords,
        name: originInput.trim(),
      });
      map.setCenter(originCords);
    } catch (e) {
      setOriginError("Could not find address");
      FailureToast("Could Not Find Address", "Make sure you entered a valid address");
    } finally {
      setLoadingOrigin(false);
    }
  }

  function confirmOriginStep() {
    if (!origin) return;
    goToStep(1);
  }

  async function setTournamentFromInput() {
    if (!map) {
      FailureToast("Something went wrong", "Please try again or report this error");
      return;
    }

    const tournamentSlug = slug(tournamentUrl.trim());
    if (!tournamentSlug) {
      setTournamentError("Could not find tournament slug");
      FailureToast("Could Not Find Tournament Slug", "Make sure the URL is correct");
      return;
    }

    setLoadingTournament(true);
    setTournamentError(null);

    try {
      const { tournament }: TournamentResponse = await startggClient.request(
        GET_TOURNAMENT_BY_URL,
        { slug: tournamentSlug },
      );

      if (!tournament) {
        setTournamentError("Could not find tournament");
        FailureToast("Could Not Find tournament", "Make sure the URL is correct");
        return;
      }

      const tournamentCords = { lat: tournament.lat, lng: tournament.lng };
      const startAtDate = tournament.startAt ? new Date(tournament.startAt * 1000) : null;
      if (startAtDate && startAtDate < new Date()) {
        setTournamentError("Tournament has already started");
        FailureToast("Tournament has already started");
        return;
      }
      setTournamentStartAt(startAtDate);
      setDestination({
        cords: tournamentCords,
        name: tournament.venueAddress,
        slug: tournamentSlug,
      });

      map.setCenter(tournamentCords);
    } catch (e) {
      setTournamentError("Could not fetch tournament");
      FailureToast("Could Not Find tournament", "Make sure the URL is correct");
    } finally {
      setLoadingTournament(false);
    }
  }

  function confirmTournamentStep() {
    if (!destination) return;
    if (tournamentStartAt && tournamentStartAt < new Date()) {
      setTournamentError("Tournament has already started");
      FailureToast("Tournament has already started");
      return;
    }
    goToStep(2);
  }

  async function fetchRoutes() {
    if (!routesLib || !map || !origin || !destination) {
      FailureToast("Something went wrong", "Please try again or report this error");
      return;
    }

    setLoadingRoutes(true);
    setRoutesError(null);

    try {
      const directionsService = new routesLib.DirectionsService();
      const { routes } = await directionsService.route({
        origin: origin.cords,
        destination: destination.cords,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      });

      if (!routes.length) {
        setRoutesError("Could not find route");
        FailureToast("Could Not Find Route");
        return;
      }

      const routeOptions = routes.map((route) => ({
        polyline: route.overview_polyline,
        distance: route.legs[0].distance?.text,
        duration: route.legs[0].duration?.text,
        bounds: route.bounds,
        summary: route.summary,
      }));

      setRoutes(routeOptions);
      setSelectedRouteIndex(null);
      map.fitBounds(routeOptions[0].bounds);
    } catch (e) {
      setRoutesError("Could not find routes");
      FailureToast("Could Not Find Route", "Check your origin and tournament");
    } finally {
      setLoadingRoutes(false);
    }
  }

  function handleSelectRoute(index: number) {
    setSelectedRouteIndex(index);
    setRoutesError(null);
    const selected = routes[index];
    if (map && selected) {
      map.fitBounds(selected.bounds);
    }
  }

  function confirmRoute() {
    if (selectedRouteIndex == null) {
      setRoutesError("Select a route to continue");
      FailureToast("Select a route to continue");
      return;
    }

    goToStep(3);
  }

  function handleDateChange(newDate: Date | undefined) {
    if (!newDate) {
      setDate(undefined);
      setDateError("Date is required");
      return;
    }

    if (tournamentStartAt && newDate > tournamentStartAt) {
      setDateError("Date must be before the tournament start");
      FailureToast("Date must be before the tournament start");
      return;
    }

    setDate(newDate);
    setDateError(null);
  }

  function validateDetails() {
    if (!date) {
      setDateError("Date is required");
      FailureToast("Date is required");
      return false;
    }

    if (date < new Date()) {
      setDateError("Date cannot be in the past");
      FailureToast("Date cannot be in the past");
      return false;
    }

    if (tournamentStartAt && date > tournamentStartAt) {
      setDateError("Date must be before tournament start");
      FailureToast("Date must be before tournament start");
      return false;
    }

    const priceValue = price.trim() === "" ? undefined : Number(price);
    if (priceValue != null && Number.isNaN(priceValue)) {
      setPriceError("Price must be a number");
      FailureToast("Price must be a number");
      return false;
    }

    if (priceValue != null && priceValue < 0) {
      setPriceError("Price must be greater than 0");
      FailureToast("Price must be greater than 0");
      return false;
    }

    if (description.trim().length >= 500) {
      setDescriptionError("Description must be smaller than 500 characters");
      FailureToast("Description must be smaller than 500 characters");
      return false;
    }

    return true;
  }

  function confirmDetailsStep() {
    if (!validateDetails()) return;
    goToStep(4);
  }

  async function addCarpool() {
    if (!origin || !destination) {
      FailureToast("Origin and tournament are required");
      return;
    }

    if (selectedRouteIndex == null) {
      FailureToast("Route not found");
      return;
    }

    const selectedRoute = routes[selectedRouteIndex];
    if (!selectedRoute?.distance) {
      FailureToast("Route distance not found");
      return;
    }

    if (!validateDetails()) return;

    const priceValue = price.trim() === "" ? undefined : Number(price);

    try {
      setAddingCarpool(true);
      const { data } = await axios.post<{ id?: number }>("/api/carpool", {
        origin: {
          cords: origin.cords,
          name: origin.name,
        },
        destination: {
          cords: destination.cords,
          name: destination.name,
          slug: destination.slug,
        },
        route: {
          polyline: selectedRoute.polyline,
          distance: selectedRoute.distance,
        },
        description: description.trim(),
        price: priceValue,
        date: date,
      });
      SuccessToast("Successfully Added Carpool", "Your good to go!");
      if (data?.id) {
        router.push(`/carpool/${data.id}`);
      }
    } catch (e) {
      handleApiError(e, "Could Not Add Carpool");
    } finally {
      setAddingCarpool(false);
    }
  }

  function renderStep(step: Step) {
    switch (step) {
      case 0:
        return (
          <StepOrigin
            originInput={originInput}
            originError={originError}
            loadingOrigin={loadingOrigin}
            canConfirm={Boolean(origin)}
            onOriginChange={(value) => {
              setOriginInput(value);
              setOriginError(null);
              setOrigin(null);
            }}
            onSetOrigin={() => void setOriginFromInput()}
            onConfirm={confirmOriginStep}
          />
        );
      case 1:
        return (
          <StepTournament
            tournamentUrl={tournamentUrl}
            tournamentError={tournamentError}
            loadingTournament={loadingTournament}
            canConfirm={Boolean(destination)}
            onTournamentChange={(value) => {
              setTournamentUrl(value);
              setTournamentError(null);
              setDestination(null);
              setTournamentStartAt(null);
            }}
            onSetTournament={() => void setTournamentFromInput()}
            onConfirm={confirmTournamentStep}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <StepRoute
            routes={routes}
            selectedRouteIndex={selectedRouteIndex}
            routesError={routesError}
            loadingRoutes={loadingRoutes}
            onSelectRoute={handleSelectRoute}
            onConfirm={confirmRoute}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <StepDetails
            date={date}
            dateError={dateError}
            maxDate={tournamentStartAt ?? undefined}
            price={price}
            priceError={priceError}
            description={description}
            descriptionError={descriptionError}
            onDateChange={handleDateChange}
            onPriceChange={(value) => {
              setPrice(value);
              setPriceError(null);
            }}
            onDescriptionChange={(value) => {
              setDescription(value);
              setDescriptionError(null);
            }}
            onBack={goBack}
            onReview={confirmDetailsStep}
          />
        );
      case 4: {
        const selectedRoute =
          selectedRouteIndex != null ? routes[selectedRouteIndex] : null;
        return (
          <StepReview
            originName={origin?.name}
            destinationName={destination?.name}
            tournamentStartAt={tournamentStartAt}
            selectedRouteIndex={selectedRouteIndex}
            selectedRoute={selectedRoute}
            date={date}
            price={price}
            description={description}
            addingCarpool={addingCarpool}
            onBack={goBack}
            onSubmit={addCarpool}
          />
        );
      }
      default:
        return null;
    }
  }

  const activeStepClass = isTransitioning
    ? transitionDir === 1
      ? styles.slideOutLeft
      : styles.slideOutRight
    : "";
  const activeStepBase = isTransitioning ? styles.stepCard : styles.stepCardStatic;
  const pendingStepClass = transitionDir === 1 ? styles.slideInRight : styles.slideInLeft;

  return (
    <div className="relative h-[94vh] md:flex md:flex-row">
      <div className="h-full w-full md:order-2 md:flex-1">
        <Map {...mapProps} style={{ width: "100%", height: "100%" }}>
          {destination?.cords && (
            <AdvancedMarker position={destination.cords}>
              <Pin {...blueMarker} />
            </AdvancedMarker>
          )}

          {origin?.cords && (
            <AdvancedMarker position={origin.cords}>
              <Pin {...orangeMarker} />
            </AdvancedMarker>
          )}

          {routes.map((route, index) => {
            const isSelected = selectedRouteIndex === index;
            return (
              <Polyline
                key={`${route.polyline}-${index}`}
                encodedPath={route.polyline}
                strokeColor={
                  isSelected
                    ? selectedRouteColor
                    : routeColors[index % routeColors.length]
                }
                strokeOpacity={isSelected ? 1 : 0.7}
                strokeWeight={isSelected ? 6 : 3}
                zIndex={isSelected ? 1000 : 1}
                onClick={() => handleSelectRoute(index)}
              />
            );
          })}
        </Map>
      </div>
      <div
        className={`${styles.stepPanel} ${sheetCollapsed ? styles.stepPanelCollapsed : ""} md:order-1`}>
        <div className={`${styles.stepPanelHeader} md:hidden`}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSheetCollapsed((prev) => !prev)}
            className="h-7 w-7 text-muted-foreground">
            {sheetCollapsed ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <div className={styles.stepShell}>
          <div className={`${activeStepBase} ${activeStepClass}`}>
            {" "}
            {renderStep(activeStep)}{" "}
          </div>
          {pendingStep !== null && (
            <div className={`${styles.stepCard} ${pendingStepClass}`}>
              {renderStep(pendingStep)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCarpoolPage;
