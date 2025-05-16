import { useForm } from "react-hook-form";
import CustomFormControl from "../Form/CustomFormControl";
import CustomInput from "../Form/CustomInput";
import {
  Box,
  Button,
  Flex,
  Heading,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Icon,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import { FaBed, FaImage, FaMoneyBillWave } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CHAMP_OBLIGATOIRE,
  DZD,
  ENREGISTRER,
  METTRE_A_JOUR,
} from "../../data/constants";
import { CATEGORIES_ROOM, CATEGORY_ROOM_LABELS } from "../../data/HotelRoom";
import { CreateHotelRoom, HotelRoom } from "../../interfaces/HotelRoom";
import { FormMode } from "../../helpers/FormUtils";

interface IHotelRoomFormValues {
  roomNumber: number;
  price: number;
  categoryRoom: string;
  imageUrl?: string;
  state?: string;
}

const hotelRoomFormValidationSchema = yup.object().shape({
  roomNumber: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .transform((val) => (val === Number(val) ? val : null)),
  price: yup
    .number()
    .required(CHAMP_OBLIGATOIRE)
    .transform((val) => (val === Number(val) ? val : null)),
  categoryRoom: yup.string().required(CHAMP_OBLIGATOIRE),
  imageUrl: yup.string().optional(),
  state: yup.string().optional(),
});

type HotelRoomFormProps = {
  submitFunction: (values: CreateHotelRoom) => void;
  formIsSubmitting: boolean;
  formMode: FormMode;
  hotelRoom?: HotelRoom;
};

const HotelRoomForm = ({
  submitFunction,
  formIsSubmitting,
  formMode,
  hotelRoom,
}: HotelRoomFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IHotelRoomFormValues>({
    mode: "onChange",
    resolver: yupResolver(hotelRoomFormValidationSchema),
    defaultValues: {
      ...(hotelRoom && {
        roomNumber: hotelRoom.roomNumber,
        price: hotelRoom.price,
        categoryRoom: hotelRoom.category.toString(),
        state: hotelRoom.state,
        imageUrl: hotelRoom.imageUrl,
      }),
    },
  });

  const onSubmit = (values: IHotelRoomFormValues) => {
    const newHotelRoom: CreateHotelRoom = {
      id: values.roomNumber.toString(),
      roomNumber: values.roomNumber,
      price: values.price,
      category: values.categoryRoom as any,
      state: "",
      imageUrl: values.imageUrl ?? "",
    };

    submitFunction(newHotelRoom);
  };

  // Color mode values for consistent theming
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const iconColor = useColorModeValue("primary.500", "primary.300");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {/* Room Basic Information Section */}
        <Card 
          mb={6} 
          variant="outline" 
          borderColor={borderColor} 
          boxShadow="sm"
          borderRadius="md"
          overflow="hidden"
        >
          <CardHeader 
            bg={sectionBg} 
            py={3} 
            px={4} 
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Flex align="center">
              <Icon as={FaBed} mr={2} color={iconColor} />
              <Heading as="h3" size="md" fontWeight="medium">
                {"Informations de la chambre"}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody p={4}>
            {/* Room Number and Price */}
            <Box mb={5}>
              <Flex align="center" mb={3}>
                <Icon as={FaMoneyBillWave} mr={2} color={iconColor} size="sm" />
                <Text fontWeight="medium">Numéro et tarif</Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <CustomFormControl
                  label={"Numéro de chambre"}
                  errorField={errors.roomNumber}
                  isRequired
                >
                  <CustomInput
                    type="number"
                    name="roomNumber"
                    register={register}
                    min={0}
                    disabled={formMode === FormMode.MODIFICATION}
                  />
                </CustomFormControl>
                <CustomFormControl
                  label={"Prix (par nuit)"}
                  errorField={errors.price}
                  isRequired
                >
                  <InputGroup>
                    <CustomInput
                      type="number"
                      name="price"
                      register={register}
                      min={0}
                    />
                    <InputRightElement style={{ fontWeight: "600" }}>
                      {DZD}
                    </InputRightElement>
                  </InputGroup>
                </CustomFormControl>
              </SimpleGrid>
            </Box>

            {/* Category and Image */}
            <Box>
              <Flex align="center" mb={3}>
                <Icon as={FaImage} mr={2} color={iconColor} size="sm" />
                <Text fontWeight="medium">Catégorie et image</Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <CustomFormControl
                  label="Catégorie"
                  errorField={errors.categoryRoom}
                  isRequired
                >
                  <Select
                    {...register("categoryRoom")}
                    placeholder={"Sélectionner une catégorie"}
                    focusBorderColor="primary.300"
                    size="md"
                    bg="white"
                  >
                    {CATEGORIES_ROOM.map((category) => (
                      <option value={category} key={category}>
                        {CATEGORY_ROOM_LABELS[category]}
                      </option>
                    ))}
                  </Select>
                </CustomFormControl>
                <CustomFormControl
                  label={"Photo de la chambre"}
                  errorField={errors.imageUrl}
                >
                  <CustomInput
                    type="text"
                    name="imageUrl"
                    register={register}
                    placeholder="Saisir une url"
                  />
                </CustomFormControl>
              </SimpleGrid>
            </Box>

            {formMode === FormMode.MODIFICATION && (
              <Box mt={4}>
                <CustomFormControl
                  label={"État de la chambre"}
                  errorField={errors.state}
                >
                  <CustomInput type="text" name="state" register={register} />
                </CustomFormControl>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Submit Button */}
        <Box 
          mt={8} 
          p={4} 
          borderRadius="md" 
          bg={sectionBg}
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <Button
            type="submit"
            colorScheme="primary"
            isDisabled={!isValid}
            isLoading={formIsSubmitting}
            size="lg"
            px={10}
            py={6}
            boxShadow="md"
            _hover={{ 
              boxShadow: "lg",
              transform: "translateY(-2px)"
            }}
            transition="all 0.2s"
          >
            {formMode === FormMode.CREATION ? ENREGISTRER : METTRE_A_JOUR}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default HotelRoomForm;
